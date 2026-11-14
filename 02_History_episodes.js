/**
 * CASCAS RSS importer
 * Run from the project root after creating .env with:
 * SUPABASE_URL=https://YOUR_PROJECT.supabase.co
 * SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
 *
 * Install once:
 * npm install @supabase/supabase-js rss-parser dotenv
 *
 * IMPORTANT:
 * - Keep the service-role key private. Do not put it in the React Native app.
 * - The importer reads rss_url from the existing podcasts row.
 * - Existing episodes are preserved; rows with an existing episode_guid are skipped.
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const Parser = require("rss-parser");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Заполни SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY в .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const parser = new Parser({
  customFields: {
    item: [
      ["itunes:duration", "itunesDuration"],
      ["itunes:image", "itunesImage", { keepArray: false }],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

const PODCAST_ID = "2356e0c0-9bac-4273-b7b3-b88179c55d29";
const PODCAST_LABEL = "Рассказы из Русской Истории";

function cleanText(value) {
  if (!value) return null;
  return String(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || null;
}

function durationToSeconds(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number") return Math.round(value);
  const parts = String(value).trim().split(":").map(Number);
  if (!parts.length || parts.some((n) => !Number.isFinite(n))) return null;
  return parts.reduce((total, part) => total * 60 + part, 0);
}

function getAudioUrl(item) {
  if (item.enclosure && item.enclosure.url) return item.enclosure.url;
  const enclosure = (item.enclosures || []).find((entry) =>
    entry.url && (!entry.type || entry.type.startsWith("audio/"))
  );
  return enclosure?.url || null;
}

function getCoverUrl(item, feed, podcast) {
  return (
    item.itunesImage?.href ||
    item.itunesImage?.$?.href ||
    item.image?.url ||
    feed.image?.url ||
    podcast.cover_url ||
    null
  );
}

async function main() {
  console.log(`Импорт: ${PODCAST_LABEL}`);

  const { data: podcast, error: podcastError } = await supabase
    .from("podcasts")
    .select("id,title,rss_url,cover_url,is_published")
    .eq("id", PODCAST_ID)
    .single();

  if (podcastError) throw podcastError;
  if (!podcast?.rss_url) {
    throw new Error(`У подкаста "${PODCAST_LABEL}" не заполнено поле rss_url.`);
  }

  const feed = await parser.parseURL(podcast.rss_url);
  const items = feed.items || [];
  if (!items.length) throw new Error("RSS-лента открылась, но в ней нет выпусков.");

  const prepared = items.map((item) => {
    const guid = item.guid || item.id || item.link || null;
    const audioUrl = getAudioUrl(item);
    return {
      podcast_id: PODCAST_ID,
      title: cleanText(item.title) || "Без названия",
      description: cleanText(item.contentEncoded || item.content || item.contentSnippet || item.summary),
      audio_url: audioUrl,
      cover_url: getCoverUrl(item, feed, podcast),
      duration: durationToSeconds(item.itunesDuration || item.duration),
      published_at: item.isoDate || item.pubDate || null,
      episode_guid: guid ? String(guid) : null,
      is_published: true,
    };
  }).filter((episode) => episode.audio_url);

  if (!prepared.length) {
    throw new Error("В RSS не найдены аудиоссылки (enclosure). Ничего не записано.");
  }

  // Read existing GUIDs for this podcast in pages; do not overwrite existing rows.
  const existing = new Set();
  for (let from = 0; ; from += 500) {
    const { data, error } = await supabase
      .from("episodes")
      .select("episode_guid")
      .eq("podcast_id", PODCAST_ID)
      .not("episode_guid", "is", null)
      .range(from, from + 499);
    if (error) throw error;
    for (const row of data || []) existing.add(row.episode_guid);
    if (!data || data.length < 500) break;
  }

  const seenInFeed = new Set();
  const fresh = prepared.filter((episode) => {
    if (!episode.episode_guid) return true;
    if (existing.has(episode.episode_guid) || seenInFeed.has(episode.episode_guid)) return false;
    seenInFeed.add(episode.episode_guid);
    return true;
  });

  if (!fresh.length) {
    console.log(`Новых выпусков нет. В RSS: ${prepared.length}; уже в базе.`);
    return;
  }

  for (let i = 0; i < fresh.length; i += 50) {
    const batch = fresh.slice(i, i + 50);
    const { error } = await supabase.from("episodes").insert(batch);
    if (error) throw error;
    console.log(`Добавлено ${Math.min(i + 50, fresh.length)} из ${fresh.length}`);
  }

  console.log(`Готово. В RSS: ${items.length}; с аудио: ${prepared.length}; добавлено: ${fresh.length}; пропущено как уже существующие: ${prepared.length - fresh.length}.`);
}

main().catch((error) => {
  console.error("Ошибка импорта:", error.message || error);
  process.exit(1);
});
