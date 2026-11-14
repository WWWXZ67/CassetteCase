
import React, { useEffect, useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Image,
    ActivityIndicator,
    ScrollView,
    Alert
} from 'react-native';

import ButtonBack from '../../components/Button/3/ButtonBack';
import ButtonPlay from '../../components/Button/3/ButtonPlay';
import ButtonFavorite from '../../components/Button/4/ButtonFavorite';
import ButtonDowland from '../../components/Button/4/ButtonDowland';
import ButtonQueue from '../../components/Button/4/ButtonQueue';
import { useQueue } from '../../Podcast/Context/QueueContext';

import { getEpisodeById } from '../../Podcast/Services/PodcastService';
import {
    addFavorite,
    removeFavorite,
    isEpisodeFavorite
} from '../../Podcast/Services/FavoritesService';
import { downloadEpisode } from '../../Podcast/Services/DownloadsService';


// Очистка HTML-разметки описания
const cleanDescription = (html) => {

    if (!html) {
        return 'Описание выпуска пока отсутствует.';
    }

    return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;|&apos;/gi, "'")
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&#(\d+);/g, (_, code) =>
            String.fromCodePoint(Number(code))
        )
        .replace(/&mdash;/gi, '—')
        .replace(/&ndash;/gi, '–')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
};


import { useTheme } from '../../theme';

export default function EpisodeScr({ navigation, route }) {

    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { addToQueue } = useQueue();

    const episodeId = route.params?.episodeId;

    const [episode, setEpisode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);


    // Загрузка выпуска из Supabase
    useEffect(() => {

        let isActive = true;

        async function loadEpisode() {

            if (!episodeId) {
                setError('Не передан ID выпуска');
                setLoading(false);
                return;
            }

            try {

                setLoading(true);
                setError(null);

                const data = await getEpisodeById(episodeId);

                if (isActive) {
                    setEpisode(data);
                }

            } catch (err) {

                console.error('Ошибка загрузки выпуска:', err);

                if (isActive) {
                    setError('Не удалось загрузить выпуск');
                }

            } finally {

                if (isActive) {
                    setLoading(false);
                }

            }

        }

        loadEpisode();

        return () => {
            isActive = false;
        };

    }, [episodeId]);


    // Проверяем, находится ли выпуск в избранном текущего пользователя.
    useEffect(() => {
        let isActive = true;

        async function loadFavoriteStatus() {
            if (!episode?.id) return;

            try {
                const favorite = await isEpisodeFavorite(episode.id);
                if (isActive) setIsFavorite(favorite);
            } catch (err) {
                console.error('Ошибка проверки избранного:', err);
            }
        }

        loadFavoriteStatus();

        return () => {
            isActive = false;
        };
    }, [episode?.id]);

    // Форматирование продолжительности
    const formatDuration = (seconds) => {

        if (!seconds) return 'Неизвестно';

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
    };


    // Избранное
    const handleFavorite = async () => {
        if (!episode?.id || favoriteLoading) return;

        try {
            setFavoriteLoading(true);

            if (isFavorite) {
                await removeFavorite(episode.id);
                setIsFavorite(false);
            } else {
                await addFavorite(episode.id);
                setIsFavorite(true);
            }
        } catch (err) {
            console.error('Ошибка изменения избранного:', err);
            Alert.alert(
                'Избранное',
                err.message || 'Не удалось изменить избранное. Попробуйте ещё раз.'
            );
        } finally {
            setFavoriteLoading(false);
        }
    };


    // Добавление выпуска в очередь
    const handleAddToQueue = () => {
        try {
            const result = addToQueue(episode);
            Alert.alert(
                result.added ? 'Добавлено в очередь' : 'Уже в очереди',
                result.added
                    ? 'Выпуск будет воспроизведён после текущего.'
                    : 'Этот выпуск уже есть в очереди.'
            );
        } catch (err) {
            Alert.alert('Очередь', err.message || 'Не удалось добавить выпуск.');
        }
    };

    // Скачивание
    const handleDownload = async () => {
        if (!episode || downloadLoading) return;

        try {
            setDownloadLoading(true);
            await downloadEpisode({
                ...episode,
                podcastName: episode.podcasts?.title || podcastName,
                coverUrl: episode.cover_url || coverUrl,
            });
            Alert.alert('Загрузки', 'Выпуск успешно скачан и доступен в разделе «Загрузки».');
        } catch (err) {
            console.error('Ошибка скачивания выпуска:', err);
            Alert.alert('Не удалось скачать', err.message || 'Проверьте подключение к интернету и попробуйте ещё раз.');
        } finally {
            setDownloadLoading(false);
        }
    };


    // Загрузка
    if (loading) {

        return (

            <View style={styles.loadingContainer}>

                <ButtonBack
                    onPress={() => navigation.goBack()}
                />

                <View style={styles.center}>

                    <ActivityIndicator
                        size="large"
                        color="#FF7139"
                    />

                    <Text style={styles.statusText}>
                        Загружаем выпуск...
                    </Text>

                </View>

            </View>

        );

    }


    // Ошибка
    if (error || !episode) {

        return (

            <View style={styles.loadingContainer}>

                <ButtonBack
                    onPress={() => navigation.goBack()}
                />

                <View style={styles.center}>

                    <Text style={styles.error}>
                        {error || 'Выпуск не найден'}
                    </Text>

                </View>

            </View>

        );

    }


    const episodeTitle = episode.title;

    const podcastName =
        episode.podcasts?.title ||
        route.params?.podcastName ||
        'Название подкаста';

    const coverUrl =
        episode.cover_url ||
        episode.podcasts?.cover_url ||
        null;

    const description = cleanDescription(episode.description);

    const duration = episode.duration;


    return (

        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >

            {/* Верхняя панель */}
            <View style={styles.header}>

                <ButtonBack
                    onPress={() => navigation.goBack()}
                />

                <Text style={styles.headerLabel}>
                    ВЫПУСК
                </Text>

            </View>


            {/* Обложка с рассеянным свечением */}
            <View style={styles.coverWrapper}>

                {/* Широкий внешний ореол */}
                <View style={styles.glowOuter} />

                {/* Средний слой света */}
                <View style={styles.glowMiddle} />

                {/* Яркое свечение непосредственно под обложкой */}
                <View style={styles.glowInner} />

                {/* Сама обложка */}
                <View style={styles.cover}>

                    {coverUrl ? (

                        <Image
                            source={{ uri: coverUrl }}
                            style={styles.coverImage}
                            resizeMode="cover"
                        />

                    ) : (

                        <View style={styles.coverPlaceholder}>

                            <Text style={styles.coverText}>
                                CASSETTE CASE
                            </Text>

                        </View>

                    )}

                </View>

            </View>


            {/* Информация о выпуске */}
            <View style={styles.info}>

                <Text style={styles.eyebrow}>
                    ВЫПУСК ПОДКАСТА
                </Text>

                <Text style={styles.title}>
                    {episodeTitle}
                </Text>

                <Text style={styles.podcast}>
                    {podcastName}
                </Text>


                {/* Продолжительность */}
                <View style={styles.durationContainer}>

                    <Text style={styles.durationIcon}>
                        ◷
                    </Text>

                    <Text style={styles.duration}>
                        {formatDuration(duration)}
                    </Text>

                    <View style={styles.durationDot} />

                    <Text style={styles.durationLabel}>
                        Аудиовыпуск
                    </Text>

                </View>

            </View>


            {/* Описание */}
            <View style={styles.descriptionContainer}>

                <Text style={styles.descriptionHeading}>
                    О выпуске
                </Text>

                <Text style={styles.description}>
                    {description}
                </Text>

            </View>


            {/* Воспроизведение */}
            <View style={styles.playContainer}>

                <ButtonPlay

                    onPress={() => navigation.navigate('Player', {

                        episodeId: episode.id,
                        episodeTitle: episodeTitle,
                        podcastName: podcastName,
                        audioUrl: episode.audio_url,
                        coverUrl: coverUrl,
                        duration: duration

                    })}

                />

            </View>


            {/* Дополнительные действия */}
            <View style={styles.actions}>

                <View style={styles.actionItem}>

                    <ButtonFavorite
                        isFavorite={isFavorite}
                        onPress={handleFavorite}
                        disabled={favoriteLoading}
                    />

                    <Text style={styles.actionLabel}>
                        Избранное
                    </Text>

                </View>


                <View style={styles.actionItem}>

                    <ButtonDowland
                        onPress={handleDownload}
                        disabled={downloadLoading}
                    />

                    <Text style={styles.actionLabel}>
                        Скачать
                    </Text>

                </View>

            </View>

            <View style={styles.queueAction}>
                <ButtonQueue
                    title="Добавить в очередь"
                    onPress={handleAddToQueue}
                />
            </View>

            <View style={styles.bottomSpace} />

        </ScrollView>

    );

}


function createStyles(theme) {

    return StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: theme.surface,
    },

    scrollContent: {
        paddingHorizontal: 22,
        paddingTop: 12,
        paddingBottom: 35,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
    },

    headerLabel: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 2,
        color: theme.primary,
    },


    // Обёртка обложки
    coverWrapper: {
        width: 220,
        height: 220,
        alignSelf: 'center',
        marginBottom: 35,
        position: 'relative',
    },


    // Широкий мягкий ореол
    glowOuter: {
        position: 'absolute',
        top: -8,
        left: -8,
        right: -8,
        bottom: -8,

        borderRadius: 32,
        backgroundColor: '#FF7139',

        opacity: 0.22,

        transform: [{ scale: 1.12 }],

        shadowColor: '#FF7139',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.9,
        shadowRadius: 35,

        elevation: 15,
    },


    // Среднее рассеивание света
    glowMiddle: {
        position: 'absolute',
        top: -4,
        left: -4,
        right: -4,
        bottom: -4,

        borderRadius: 28,
        backgroundColor: '#FF853F',

        opacity: 0.38,

        transform: [{ scale: 1.07 }],

        shadowColor: '#FF7139',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.85,
        shadowRadius: 23,

        elevation: 18,
    },


    // Яркий свет по контуру
    glowInner: {
        position: 'absolute',
        top: -1,
        left: -1,
        right: -1,
        bottom: -1,

        borderRadius: 23,
        backgroundColor: '#FF7139',

        opacity: 0.65,

        shadowColor: '#FF7139',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 13,

        elevation: 20,
    },


    // Обложка
    cover: {
        width: '100%',
        height: '100%',

        backgroundColor: theme.surfaceLight,

        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',

        overflow: 'hidden',

        zIndex: 1,
    },

    coverImage: {
        width: '100%',
        height: '100%',
    },

    coverPlaceholder: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#252525',
    },

    coverText: {
        color: theme.primary,
        fontWeight: 'bold',
        letterSpacing: 3,
        fontSize: 17,
    },


    // Информация
    info: {
        alignItems: 'center',
        marginTop: 5,
    },

    eyebrow: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
        color: theme.primary,
        marginBottom: 12,
    },

    title: {
        fontSize: 25,
        lineHeight: 32,
        fontWeight: '800',
        color: theme.text,
        textAlign: 'center',
    },

    podcast: {
        fontSize: 16,
        color: theme.textSecondary,
        marginTop: 12,
        fontWeight: '500',
    },


    // Продолжительность
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: theme.cardSecondary || theme.surfaceLight,

        paddingHorizontal: 17,
        paddingVertical: 10,

        borderRadius: 30,
        marginTop: 22,
    },

    durationIcon: {
        color: theme.primary,
        fontSize: 19,
        marginRight: 7,
    },

    duration: {
        color: theme.text,
        fontSize: 13,
        fontWeight: '700',
    },

    durationDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#AAAAAA',
        marginHorizontal: 10,
    },

    durationLabel: {
        color: theme.textSecondary,
        fontSize: 12,
    },


    // Описание
    descriptionContainer: {
        backgroundColor: theme.card || theme.surfaceLight,
        borderRadius: 16,
        padding: 18,
        marginTop: 27,
        borderWidth: 1,
        borderColor: theme.surfaceLight,
    },

    descriptionHeading: {
        fontSize: 16,
        fontWeight: '800',
        color: theme.text,
        marginBottom: 10,
    },

    description: {
        fontSize: 14,
        lineHeight: 23,
        color: theme.textSecondary,
    },


    // Кнопка воспроизведения
    playContainer: {
        alignItems: 'center',
        marginTop: 30,
    },


    // Дополнительные действия
    actions: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 55,
        marginTop: 25,
    },

    actionItem: {
        alignItems: 'center',
        gap: 7,
    },

    actionLabel: {
        fontSize: 12,
        color: theme.textSecondary,
        fontWeight: '500',
    },

    queueAction: {
        alignItems: 'center',
        marginTop: 18,
        marginBottom: 8,
    },

    bottomSpace: {
        height: 20,
    },


    // Загрузка и ошибки
    loadingContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: theme.surface,
    },

    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    statusText: {
        color: theme.textSecondary,
        marginTop: 12,
    },

    error: {
        color: '#CC3333',
        textAlign: 'center',
        fontSize: 15,
    },

});

}
