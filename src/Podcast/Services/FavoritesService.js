import { supabase } from '../../Auth/Config/supabaseClient';

async function getCurrentUserId() {
    const {
        data: { user },
        error
    } = await supabase.auth.getUser();

    if (error) throw error;
    if (!user) {
        throw new Error('Для работы с избранным необходимо войти в аккаунт.');
    }

    return user.id;
}

// Добавить выпуск в избранное. Уникальность пары user_id + episode_id
// дополнительно гарантируется ограничением в базе данных.
export async function addFavorite(episodeId) {
    if (!episodeId) throw new Error('Не указан ID выпуска.');

    const userId = await getCurrentUserId();

    const { error } = await supabase
        .from('favorites')
        .upsert(
            {
                user_id: userId,
                episode_id: episodeId
            },
            {
                onConflict: 'user_id,episode_id',
                ignoreDuplicates: true
            }
        );

    if (error) {
        console.error('Ошибка добавления в избранное:', error.message);
        throw error;
    }
}

// Удалить выпуск из избранного текущего пользователя.
export async function removeFavorite(episodeId) {
    if (!episodeId) throw new Error('Не указан ID выпуска.');

    const userId = await getCurrentUserId();

    const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('episode_id', episodeId);

    if (error) {
        console.error('Ошибка удаления из избранного:', error.message);
        throw error;
    }
}

// Проверить, добавлен ли выпуск в избранное.
export async function isEpisodeFavorite(episodeId) {
    if (!episodeId) return false;

    const userId = await getCurrentUserId();

    const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('episode_id', episodeId)
        .maybeSingle();

    if (error) {
        console.error('Ошибка проверки избранного:', error.message);
        throw error;
    }

    return !!data;
}

// Получить избранные выпуски вместе с информацией о подкасте.
export async function getFavorites() {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
        .from('favorites')
        .select(`
            id,
            episode_id,
            created_at,
            episodes (
                id,
                title,
                duration,
                description,
                audio_url,
                cover_url,
                podcast_id,
                podcasts (
                    title,
                    author,
                    cover_url
                )
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Ошибка загрузки избранного:', error.message);
        throw error;
    }

    return (data || [])
        .filter((item) => item.episodes)
        .map((item) => ({
            ...item.episodes,
            favorite_id: item.id,
            podcast: item.episodes.podcasts?.title || 'Подкаст',
            podcast_author: item.episodes.podcasts?.author || '',
            cover_url:
                item.episodes.cover_url ||
                item.episodes.podcasts?.cover_url ||
                null
        }));
}
