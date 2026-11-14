
import { supabase } from "../../Auth/Config/supabaseClient";

// Получение списка опубликованных подкастов
export async function getPodcasts() {
    const { data, error } = await supabase
        .from("podcasts")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Ошибка загрузки подкастов:", error.message);
        throw error;
    }

    return data;
}

// Получение одного подкаста
export async function getPodcastById(podcastId) {
    const { data, error } = await supabase
        .from("podcasts")
        .select("*")
        .eq("id", podcastId)
        .eq("is_published", true)
        .single();

    if (error) {
        console.error("Ошибка загрузки подкаста:", error.message);
        throw error;
    }

    return data;
}

// Получение выпусков конкретного подкаста
export async function getEpisodesByPodcastId(podcastId) {
    const { data, error } = await supabase
        .from("episodes")
        .select("*")
        .eq("podcast_id", podcastId)
        .eq("is_published", true)
        .order("published_at", { ascending: false });

    if (error) {
        console.error("Ошибка загрузки выпусков:", error.message);
        throw error;
    }

    return data;
}

// Получение одного выпуска
export async function getEpisodeById(episodeId) {
    const { data, error } = await supabase
        .from("episodes")
        .select("*, podcasts(title, author, cover_url)")
        .eq("id", episodeId)
        .eq("is_published", true)
        .single();

    if (error) {
        console.error("Ошибка загрузки выпуска:", error.message);
        throw error;
    }

    return data;
}

// Получение последних выпусков для главной страницы
export async function getLatestEpisodes(limit = 10) {
    const { data, error } = await supabase
        .from("episodes")
        .select("*, podcasts(title, author)")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Ошибка загрузки рекомендаций:", error.message);
        throw error;
    }

    return data;
}


// Сохранение прослушивания
export async function saveListeningHistory(episodeId, progress = 0) {

    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
        console.log('Пользователь не авторизован');
        return;
    }

    const { error } = await supabase
        .from('listening_history')
        .upsert({
            user_id: user.id,
            episode_id: episodeId,
            last_played_at: new Date().toISOString(),
            progress: Math.floor(progress)
        }, {
            onConflict: 'user_id,episode_id'
        });

    if (error) {
        console.error('Ошибка сохранения истории:', error.message);
        throw error;
    }
}


// Получение истории прослушивания
// Передача null позволяет получить все записи без ограничения.
export async function getListeningHistory(limit = 10) {

    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) return [];

    let query = supabase
        .from('listening_history')
        .select(`
            id,
            last_played_at,
            progress,
            episodes (
                id,
                title,
                duration,
                cover_url,
                audio_url,
                podcast_id,
                podcasts (
                    title,
                    author,
                    cover_url
                )
            )
        `)
        .eq('user_id', user.id)
        .order('last_played_at', { ascending: false });

    if (Number.isFinite(limit) && limit > 0) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Ошибка загрузки истории:', error.message);
        throw error;
    }

    return data || [];
}


// Полная очистка истории текущего пользователя
export async function clearListeningHistory() {

    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
        throw new Error('Необходимо авторизоваться.');
    }

    const { error } = await supabase
        .from('listening_history')
        .delete()
        .eq('user_id', user.id);

    if (error) {
        console.error('Ошибка очистки истории:', error.message);
        throw error;
    }

    return true;
}
