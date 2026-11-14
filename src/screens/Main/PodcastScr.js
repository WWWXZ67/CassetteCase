import React, { useEffect, useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    ActivityIndicator
} from 'react-native';

import ButtonBack from '../../components/Button/3/ButtonBack';
import BarEpisodeCard from '../../components/StatusBar/BarEpisodeCard';

import {
    getPodcastById,
    getEpisodesByPodcastId
} from '../../Podcast/Services/PodcastService';


import { useTheme } from '../../theme';

export default function PodcastScr({ navigation, route }) {

    const { theme } = useTheme();
    const styles = createStyles(theme);

    const podcastId = route.params?.podcastId;

    const [podcast, setPodcast] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        let isActive = true;

        async function loadPodcast() {

            if (!podcastId) {
                setError('Не передан ID подкаста');
                setLoading(false);
                return;
            }

            try {

                setLoading(true);
                setError(null);

                const [podcastData, episodesData] = await Promise.all([
                    getPodcastById(podcastId),
                    getEpisodesByPodcastId(podcastId)
                ]);

                if (isActive) {
                    setPodcast(podcastData);
                    setEpisodes(episodesData);
                }

            } catch (err) {

                console.error('Ошибка загрузки подкаста:', err);

                if (isActive) {
                    setError('Не удалось загрузить подкаст');
                }

            } finally {

                if (isActive) {
                    setLoading(false);
                }

            }

        }

        loadPodcast();

        return () => {
            isActive = false;
        };

    }, [podcastId]);


    const formatDuration = (seconds) => {

        if (!seconds) return 'Неизвестно';

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
    };


    if (loading) {

        return (
            <View style={styles.container}>

                <ButtonBack onPress={() => navigation.goBack()} />

                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.text} />
                    <Text style={styles.statusText}>
                        Загружаем подкаст...
                    </Text>
                </View>

            </View>
        );

    }


    if (error || !podcast) {

        return (
            <View style={styles.container}>

                <ButtonBack onPress={() => navigation.goBack()} />

                <View style={styles.center}>
                    <Text style={styles.error}>
                        {error || 'Подкаст не найден'}
                    </Text>
                </View>

            </View>
        );

    }


    return (

        <ScrollView style={styles.container}>

            <ButtonBack
                onPress={() => navigation.goBack()}
            />

            {/* Обложка подкаста */}
            <View style={styles.cover}>

                {podcast.cover_url ? (

                    <Image
                        source={{ uri: podcast.cover_url }}
                        style={styles.coverImage}
                    />

                ) : (

                    <Text style={styles.coverText}>
                        Обложка подкаста
                    </Text>

                )}

            </View>


            {/* Название */}
            <Text style={styles.title}>
                {podcast.title}
            </Text>


            {/* Автор */}
            <Text style={styles.author}>
                {podcast.author || 'Автор не указан'}
            </Text>


            {/* Описание */}
            <Text style={styles.description}>
                {podcast.description || 'Описание подкаста отсутствует.'}
            </Text>


            {/* Выпуски */}
            <Text style={styles.heading}>
                Выпуски ({episodes.length})
            </Text>


            {episodes.length === 0 ? (

                <Text style={styles.statusText}>
                    Пока нет опубликованных выпусков.
                </Text>

            ) : (

                episodes.map((item) => (

                    <BarEpisodeCard

                        key={item.id}

                        title={item.title}

                        podcastName={podcast.title}

                        duration={formatDuration(item.duration)}

                        onPress={() => navigation.navigate('Episode', {

                            episodeId: item.id,

                            episodeTitle: item.title,

                            podcastName: podcast.title

                        })}

                    />

                ))

            )}

        </ScrollView>

    );

}


function createStyles(theme) {

    return StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        backgroundColor: theme.surface,
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    statusText: {
        color: theme.textSecondary,
        textAlign: 'center',
        marginTop: 12,
    },

    error: {
        color: '#CC3333',
        textAlign: 'center',
    },

    cover: {
        width: 180,
        height: 180,
        backgroundColor: theme.surfaceLight,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginVertical: 25,
        overflow: 'hidden',
    },

    coverImage: {
        width: '100%',
        height: '100%',
    },

    coverText: {
        color: theme.textSecondary,
        fontSize: 14,
    },

    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: theme.text,
        textAlign: 'center',
    },

    author: {
        fontSize: 15,
        color: theme.textSecondary,
        textAlign: 'center',
        marginTop: 8,
    },

    description: {
        fontSize: 15,
        color: '#555555',
        lineHeight: 23,
        marginVertical: 20,
    },

    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.text,
        marginTop: 30,
        marginBottom: 15,
    },

});

}
