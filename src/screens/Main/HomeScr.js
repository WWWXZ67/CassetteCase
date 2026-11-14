
import React, {
    useState,
    useCallback
} from 'react';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import BarEpisodeCard from '../../components/StatusBar/BarEpisodeCard';

import {
    getPodcasts,
    getLatestEpisodes,
    getListeningHistory
} from '../../Podcast/Services/PodcastService';

import { useTheme } from '../../theme';


export default function HomeScr({ navigation }) {

    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [podcasts, setPodcasts] = useState([]);
    const [episodes, setEpisodes] = useState([]);
    const [recentEpisodes, setRecentEpisodes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);


    // Перемешивание подкастов
    const shuffleArray = (array) => {
        const result = [...array];

        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [result[i], result[j]] = [
                result[j],
                result[i]
            ];
        }

        return result;
    };


    // Загрузка главной страницы
    const loadHome = useCallback(async (isRefresh = false) => {

        try {

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError(null);

            const [podcastsData, episodesData, historyData] = await Promise.all([
                getPodcasts(),
                getLatestEpisodes(10),
                getListeningHistory(5).catch(historyError => {
                    console.error(
                        'Ошибка загрузки недавно прослушанного:',
                        historyError
                    );
                    return [];
                })
            ]);

            setPodcasts(shuffleArray(podcastsData || []));
            setEpisodes(episodesData || []);
            setRecentEpisodes(
                (historyData || [])
                    .filter(item => item?.episodes?.id)
                    .map(item => ({
                        ...item.episodes,
                        last_played_at: item.last_played_at,
                        progress: item.progress
                    }))
            );

        } catch (err) {

            console.error(
                'Ошибка загрузки главной страницы:',
                err
            );

            setError('Не удалось загрузить данные.');

        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    }, []);


    useFocusEffect(
        useCallback(() => {
            loadHome();
        }, [loadHome])
    );


    const handleRefresh = () => {
        loadHome(true);
    };


    const openPodcast = (item) => {

        navigation.navigate('Podcast', {
            podcastId: item.id,
            podcastName: item.title
        });

    };


    const openEpisode = (item) => {

        navigation.navigate('Episode', {
            episodeId: item.id,
            episodeTitle: item.title,
            podcastName: item.podcasts?.title || item.podcastName || 'Подкаст'
        });

    };


    // Форматирование продолжительности
    const formatDuration = (duration) => {

        if (!duration) return 'Неизвестно';

        return `${Math.floor(duration / 60)}:${String(
            duration % 60
        ).padStart(2, '0')}`;

    };


    return (

        <SafeAreaView
            style={styles.safeArea}
            edges={['top']}
        >

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[theme.primary]}
                        tintColor={theme.primary}
                    />
                }
            >

                {/* Шапка */}

                <View style={styles.header}>

                    <Text style={styles.logo}>
                        Cassette Case
                    </Text>

                    <Text style={styles.greeting}>
                        Добро пожаловать!
                    </Text>

                </View>


                {/* Поиск */}

                <Pressable
                    style={({ pressed }) => [
                        styles.searchBar,
                        pressed && styles.searchPressed
                    ]}
                    onPress={() => navigation.navigate('Search')}
                    accessibilityRole="button"
                    accessibilityLabel="Открыть поиск"
                >

                    <Ionicons
                        name="search-outline"
                        size={21}
                        color={theme.textSecondary}
                    />

                    <Text style={styles.searchPlaceholder}>
                        Поиск подкастов и выпусков
                    </Text>


                </Pressable>


                {/* Популярные подкасты */}

                <View style={styles.sectionHeader}>

                    <Text style={styles.heading}>
                        Популярные подкасты
                    </Text>

                    {!loading && podcasts.length > 0 ? (
                        <Text style={styles.sectionHint}>
                            Листайте
                        </Text>
                    ) : null}

                </View>


                {loading ? (

                    <View style={styles.loaderContainer}>
                        <ActivityIndicator
                            size="large"
                            color={theme.primary}
                        />
                    </View>

                ) : error ? (

                    <Text style={styles.empty}>
                        {error}
                    </Text>

                ) : podcasts.length === 0 ? (

                    <Text style={styles.empty}>
                        Пока нет доступных подкастов.
                    </Text>

                ) : (

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.podcastList}
                        nestedScrollEnabled
                        directionalLockEnabled
                    >

                        {podcasts.map((item) => (

                            <Pressable
                                key={item.id}
                                style={({ pressed }) => [
                                    styles.podcastCard,
                                    pressed && styles.podcastPressed
                                ]}
                                onPress={() => openPodcast(item)}
                            >

                                <View style={styles.podcastIcon}>

                                    <Ionicons
                                        name="radio-outline"
                                        size={25}
                                        color={theme.primary}
                                    />

                                </View>

                                <Text
                                    style={styles.podcastTitle}
                                    numberOfLines={2}
                                >
                                    {item.title}
                                </Text>

                                <Text
                                    style={styles.author}
                                    numberOfLines={1}
                                >
                                    {item.author || 'Автор неизвестен'}
                                </Text>

                                {item.description ? (
                                    <Text
                                        style={styles.description}
                                        numberOfLines={2}
                                    >
                                        {item.description}
                                    </Text>
                                ) : null}

                            </Pressable>

                        ))}

                    </ScrollView>

                )}


                {/* Рекомендуем послушать */}

                <View style={styles.sectionHeader}>

                    <Text style={styles.heading}>
                        Рекомендуем послушать
                    </Text>

                    {!loading && episodes.length > 0 ? (
                        <Text style={styles.sectionHint}>
                            Листайте
                        </Text>
                    ) : null}

                </View>


                {loading ? null : episodes.length === 0 ? (

                    <Text style={styles.empty}>
                        Пока нет доступных выпусков.
                    </Text>

                ) : (

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.episodeList}
                        nestedScrollEnabled
                        directionalLockEnabled
                    >

                        {episodes.map((item) => (

                            <Pressable
                                key={item.id}
                                style={({ pressed }) => [
                                    styles.episodeCard,
                                    pressed && styles.episodePressed
                                ]}
                                onPress={() => openEpisode(item)}
                            >

                                <View style={styles.episodeIcon}>

                                    <Ionicons
                                        name="play"
                                        size={24}
                                        color={theme.primary}
                                    />

                                </View>

                                <Text
                                    style={styles.episodeTitle}
                                    numberOfLines={3}
                                >
                                    {item.title}
                                </Text>

                                <Text
                                    style={styles.episodePodcast}
                                    numberOfLines={2}
                                >
                                    {item.podcasts?.title || 'Подкаст'}
                                </Text>

                                <View style={styles.episodeFooter}>

                                    <Ionicons
                                        name="time-outline"
                                        size={14}
                                        color={theme.textMuted}
                                    />

                                    <Text style={styles.duration}>
                                        {formatDuration(item.duration)}
                                    </Text>

                                    <View style={styles.playHint}>
                                        <Ionicons
                                            name="play"
                                            size={13}
                                            color="#FFFFFF"
                                        />
                                    </View>

                                </View>

                            </Pressable>

                        ))}

                    </ScrollView>

                )}


                {/* Недавно прослушанное */}

                <Text style={styles.heading}>
                    Недавно прослушанное
                </Text>

                {recentEpisodes.length > 0 ? (
                    <View style={styles.historyList}>
                        {recentEpisodes.map(item => (
                            <View key={item.id} style={styles.historyItem}>
                                <BarEpisodeCard
                                    title={item.title}
                                    podcastName={item.podcasts?.title || 'Подкаст'}
                                    duration={formatDuration(item.duration)}
                                    image={item.cover_url || item.podcasts?.cover_url
                                        ? { uri: item.cover_url || item.podcasts?.cover_url }
                                        : null
                                    }
                                    onPress={() => openEpisode(item)}
                                />
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons
                            name="time-outline"
                            size={27}
                            color={theme.silver}
                        />
                        <Text style={styles.empty}>
                            Здесь появятся недавно прослушанные выпуски.
                        </Text>
                    </View>
                )}

            </ScrollView>

        </SafeAreaView>

    );

}


function createStyles(theme) {

    return StyleSheet.create({

        safeArea: {
            flex: 1,
            backgroundColor: theme.background,
        },

        container: {
            flex: 1,
            backgroundColor: theme.background,
        },

        content: {
            paddingTop: 14,
            paddingBottom: 40,
        },


        // Шапка

        header: {
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 23,
        },

        logo: {
            fontSize: 28,
            fontWeight: '800',
            letterSpacing: 0.3,
            color: theme.text,
            textAlign: 'center',
        },

        greeting: {
            fontSize: 15,
            color: theme.textSecondary,
            marginTop: 5,
            textAlign: 'center',
        },


        // Поиск

        searchBar: {
            minHeight: 52,
            marginHorizontal: 20,
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.surfaceLight,
            borderRadius: 16,
        },

        searchPlaceholder: {
            flex: 1,
            marginLeft: 10,
            marginRight: 0,
            fontSize: 14,
            color: theme.textMuted,
        },

        searchPressed: {
            borderColor: theme.primary,
            opacity: 0.85,
        },


        // Заголовки разделов

        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 28,
            marginBottom: 13,
            paddingHorizontal: 20,
        },

        heading: {
            flex: 1,
            fontSize: 19,
            lineHeight: 25,
            fontWeight: 'bold',
            color: theme.text,
            marginTop: 28,
            marginBottom: 13,
            marginHorizontal: 20,
        },

        sectionHint: {
            fontSize: 12,
            color: theme.textMuted,
            marginLeft: 8,
        },


        // Загрузка

        loaderContainer: {
            minHeight: 145,
            justifyContent: 'center',
            alignItems: 'center',
        },


        // Популярные подкасты

        podcastList: {
            paddingHorizontal: 20,
            paddingBottom: 4,
        },

        podcastCard: {
            width: 230,
            minHeight: 180,
            padding: 16,
            marginRight: 12,
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.surfaceLight,
            borderRadius: 17,
        },

        podcastPressed: {
            borderColor: theme.primary,
            opacity: 0.85,
        },

        podcastIcon: {
            width: 40,
            height: 40,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.background,
            marginBottom: 12,
        },

        podcastTitle: {
            fontSize: 16,
            lineHeight: 21,
            fontWeight: '700',
            color: theme.text,
        },

        author: {
            fontSize: 13,
            color: theme.textSecondary,
            marginTop: 5,
        },

        description: {
            fontSize: 12,
            lineHeight: 17,
            color: theme.textMuted,
            marginTop: 8,
        },


        // Рекомендации

        episodeList: {
            paddingHorizontal: 20,
            paddingBottom: 4,
        },

        episodeCard: {
            width: 220,
            minHeight: 175,
            padding: 16,
            marginRight: 12,
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.surfaceLight,
            borderRadius: 17,
        },

        episodePressed: {
            borderColor: theme.primary,
            opacity: 0.85,
        },

        episodeIcon: {
            width: 43,
            height: 43,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.background,
            marginBottom: 13,
        },

        episodeTitle: {
            fontSize: 15,
            lineHeight: 20,
            fontWeight: '700',
            color: theme.text,
        },

        episodePodcast: {
            fontSize: 12,
            lineHeight: 17,
            color: theme.textSecondary,
            marginTop: 6,
        },

        episodeFooter: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 'auto',
            paddingTop: 13,
        },

        duration: {
            fontSize: 12,
            color: theme.textMuted,
            marginLeft: 5,
        },

        playHint: {
            width: 27,
            height: 27,
            borderRadius: 14,
            backgroundColor: theme.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 'auto',
        },


        // Недавно прослушанное

        historyList: {
            paddingHorizontal: 20,
        },

        historyItem: {
            marginBottom: 10,
        },

        empty: {
            color: theme.textMuted,
            textAlign: 'center',
            marginVertical: 15,
            marginHorizontal: 20,
            fontSize: 13,
            lineHeight: 19,
        },

        emptyContainer: {
            alignItems: 'center',
            padding: 17,
            marginHorizontal: 20,
            backgroundColor: theme.surface,
            borderRadius: 14,
        },

    });

}
