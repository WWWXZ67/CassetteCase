import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from '../../Auth/Config/supabaseClient';

const STORAGE_PREFIX = '@cascas_downloads_';

async function getUserId() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (!user) throw new Error('Для скачивания необходимо войти в аккаунт.');
    return user.id;
}

async function getStorageKey() {
    return `${STORAGE_PREFIX}${await getUserId()}`;
}

export async function getDownloads() {
    const key = await getStorageKey();
    const raw = await AsyncStorage.getItem(key);
    const items = raw ? JSON.parse(raw) : [];
    const existing = [];

    for (const item of items) {
        const info = await FileSystem.getInfoAsync(item.localUri);
        if (info.exists) existing.push(item);
    }

    if (existing.length !== items.length) {
        await AsyncStorage.setItem(key, JSON.stringify(existing));
    }
    return existing;
}

export async function downloadEpisode(episode) {
    if (!episode?.id) throw new Error('Не указан выпуск.');
    if (!episode.audio_url || !/^https?:\/\//i.test(episode.audio_url)) {
        throw new Error('У этого выпуска нет доступной ссылки на аудио.');
    }

    const key = await getStorageKey();
    const current = await getDownloads();
    const alreadyDownloaded = current.find(item => String(item.id) === String(episode.id));
    if (alreadyDownloaded) return alreadyDownloaded;

    const directory = `${FileSystem.documentDirectory}cascas-downloads/`;
    const directoryInfo = await FileSystem.getInfoAsync(directory);
    if (!directoryInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    }

    const safeId = String(episode.id).replace(/[^a-zA-Z0-9_-]/g, '_');
    const extension = episode.audio_url.match(/\.(mp3|m4a|aac|wav|ogg)(?:[?#]|$)/i)?.[1] || 'mp3';
    const localUri = `${directory}${safeId}.${extension}`;
    const result = await FileSystem.downloadAsync(episode.audio_url, localUri);

    if (result.status < 200 || result.status >= 300) {
        throw new Error(`Не удалось скачать аудио (HTTP ${result.status}).`);
    }

    const item = {
        id: episode.id,
        title: episode.title || 'Без названия',
        podcast: episode.podcasts?.title || episode.podcastName || episode.podcast || 'Подкаст',
        duration: episode.duration || 0,
        cover_url: episode.cover_url || episode.podcasts?.cover_url || episode.coverUrl || null,
        localUri: result.uri,
        audio_url: episode.audio_url,
        downloaded_at: new Date().toISOString(),
    };

    await AsyncStorage.setItem(key, JSON.stringify([...current, item]));
    return item;
}

export async function deleteDownload(episodeId) {
    const key = await getStorageKey();
    const current = await getDownloads();
    const item = current.find(entry => String(entry.id) === String(episodeId));
    if (item?.localUri) {
        const info = await FileSystem.getInfoAsync(item.localUri);
        if (info.exists) await FileSystem.deleteAsync(item.localUri, { idempotent: true });
    }
    await AsyncStorage.setItem(key, JSON.stringify(
        current.filter(entry => String(entry.id) !== String(episodeId))
    ));
}
