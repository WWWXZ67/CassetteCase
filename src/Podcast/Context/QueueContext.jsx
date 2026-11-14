import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../Auth/Context/AuthContext';

const QueueContext = createContext(null);

export function QueueProvider({ children }) {
    const { user } = useAuth();
    const storageKey = `@cassette_case_queue_${user?.id || 'guest'}`;

    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadedKey, setLoadedKey] = useState(null);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setQueue([]);
        setLoadedKey(null);

        async function loadQueue() {
            try {
                const savedQueue = await AsyncStorage.getItem(storageKey);
                const parsed = savedQueue ? JSON.parse(savedQueue) : [];
                if (active) setQueue(Array.isArray(parsed) ? parsed : []);
            } catch (error) {
                console.error('Ошибка загрузки очереди:', error);
                if (active) setQueue([]);
            } finally {
                if (active) {
                    setLoadedKey(storageKey);
                    setLoading(false);
                }
            }
        }

        loadQueue();
        return () => { active = false; };
    }, [storageKey]);

    useEffect(() => {
        if (loading || loadedKey !== storageKey) return;
        AsyncStorage.setItem(storageKey, JSON.stringify(queue)).catch(error => {
            console.error('Ошибка сохранения очереди:', error);
        });
    }, [queue, loading, loadedKey, storageKey]);

    const addToQueue = (episode) => {
        if (!episode?.id) throw new Error('Не указан ID выпуска.');
        if (!episode.audio_url) throw new Error('У этого выпуска нет аудиофайла.');

        const item = {
            id: String(episode.id),
            title: episode.title || 'Без названия',
            podcast: episode.podcast || episode.podcasts?.title || episode.podcastName || 'Подкаст',
            audio_url: episode.audio_url,
            cover_url: episode.cover_url || episode.podcasts?.cover_url || episode.coverUrl || null,
            duration: Number(episode.duration) || 0
        };

        const alreadyExists = queue.some(existing => String(existing.id) === item.id);
        if (alreadyExists) return { added: false, item };
        setQueue(current => current.some(existing => String(existing.id) === item.id)
            ? current
            : [...current, item]);
        return { added: true, item };
    };

    const removeFromQueue = (episodeId) => {
        setQueue(current => current.filter(item => String(item.id) !== String(episodeId)));
    };

    const clearQueue = () => setQueue([]);

    const moveInQueue = (episodeId, direction) => {
        setQueue(current => {
            const index = current.findIndex(item => String(item.id) === String(episodeId));
            const newIndex = index + direction;
            if (index < 0 || newIndex < 0 || newIndex >= current.length) return current;
            const updated = [...current];
            [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
            return updated;
        });
    };

    const takeNext = (currentEpisodeId) => {
        const withoutCurrent = queue.filter(item => String(item.id) !== String(currentEpisodeId));
        const nextItem = withoutCurrent.find(item => !!item.audio_url) || null;
        if (!nextItem) {
            if (withoutCurrent.length !== queue.length) setQueue(withoutCurrent);
            return null;
        }
        setQueue(withoutCurrent.filter(item => String(item.id) !== String(nextItem.id)));
        return nextItem;
    };

    const value = useMemo(() => ({
        queue,
        loading,
        addToQueue,
        removeFromQueue,
        clearQueue,
        moveInQueue,
        takeNext
    }), [queue, loading]);

    return (
        <QueueContext.Provider value={value}>
            {children}
        </QueueContext.Provider>
    );
}

export function useQueue() {
    const context = useContext(QueueContext);
    if (!context) throw new Error('useQueue должен использоваться внутри QueueProvider.');
    return context;
}
