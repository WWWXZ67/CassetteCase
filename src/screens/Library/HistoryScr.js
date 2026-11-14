
import React, {
    useState,
    useCallback,
} from 'react';

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    Image,
    Alert,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

import ButtonBack from '../../components/Button/3/ButtonBack';

import { useTheme } from '../../theme';

import {
    getListeningHistory,
    clearListeningHistory,
} from '../../Podcast/Services/PodcastService';


export default function HistoryScr({ navigation }) {

    const { theme } = useTheme();

    const styles = createStyles(theme);

    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [clearing, setClearing] = useState(false);


    // Загрузка истории

    const loadHistory = useCallback(async (isRefresh = false) => {

        try {

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const data = await getListeningHistory(null);

            setHistory(data);

        } catch (error) {

            console.error('Ошибка загрузки истории:', error);

            Alert.alert(
                'История',
                'Не удалось загрузить историю прослушивания.'
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    }, []);


    // Обновляем историю при открытии экрана

    useFocusEffect(
        useCallback(() => {

            loadHistory();

        }, [loadHistory])
    );


    // Форматирование продолжительности

    const formatDuration = (duration) => {

        if (
            duration === null ||
            duration === undefined
        ) {
            return 'Продолжительность неизвестна';
        }

        if (typeof duration === 'string') {
            return duration;
        }

        const totalSeconds = Number(duration);

        if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
            return 'Продолжительность неизвестна';
        }

        const hours = Math.floor(totalSeconds / 3600);

        const minutes = Math.floor(
            (totalSeconds % 3600) / 60
        );

        const seconds = Math.floor(totalSeconds % 60);

        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        return `${minutes}:${String(seconds).padStart(2, '0')}`;

    };


    // Форматирование даты

    const formatDate = (date) => {

        if (!date) return '';

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return '';
        }

        return parsedDate.toLocaleString('ru-RU', {
            day: '2-digit',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
        });

    };


    // Очистка истории

    const handleClearHistory = () => {

        if (history.length === 0 || clearing) return;

        Alert.alert(
            'Очистить историю?',
            'Все записи истории прослушивания будут удалены. Это действие нельзя отменить.',

            [
                {
                    text: 'Отмена',
                    style: 'cancel',
                },

                {
                    text: 'Очистить',
                    style: 'destructive',

                    onPress: async () => {

                        try {

                            setClearing(true);

                            await clearListeningHistory();

                            setHistory([]);

                            Alert.alert(
                                'Готово',
                                'История прослушивания очищена.'
                            );

                        } catch (error) {

                            console.error(
                                'Ошибка очистки истории:',
                                error
                            );

                            Alert.alert(
                                'Ошибка',
                                'Не удалось очистить историю. Попробуйте ещё раз.'
                            );

                        } finally {

                            setClearing(false);

                        }

                    },

                },

            ]
        );

    };


    // Карточка истории

    const renderItem = ({ item }) => {

        const episode = item.episodes;

        if (!episode) return null;

        const podcast = episode.podcasts || {};

        const cover =
            episode.cover_url ||
            podcast.cover_url;

        return (

            <Pressable

                style={styles.card}

                onPress={() => {

                    navigation.navigate('Episode', {
                        episodeId: episode.id,
                    });

                }}

            >

                {cover ? (

                    <Image
                        source={{ uri: cover }}
                        style={styles.cover}
                    />

                ) : (

                    <View style={styles.coverPlaceholder}>

                        <Ionicons
                            name="headset-outline"
                            size={27}
                            color={theme.textSecondary}
                        />

                    </View>

                )}


                <View style={styles.info}>

                    <Text
                        style={styles.podcast}
                        numberOfLines={1}
                    >
                        {podcast.title || 'Неизвестный подкаст'}
                    </Text>

                    <Text
                        style={styles.title}
                        numberOfLines={2}
                    >
                        {episode.title || 'Без названия'}
                    </Text>

                    <View style={styles.metadata}>

                        <Ionicons
                            name="time-outline"
                            size={13}
                            color={theme.textSecondary}
                        />

                        <Text style={styles.duration}>
                            {formatDuration(episode.duration)}
                        </Text>

                    </View>

                    <Text style={styles.date}>
                        {formatDate(item.last_played_at)}
                    </Text>

                </View>


                <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.textMuted}
                />

            </Pressable>

        );

    };


    return (

        <View style={styles.container}>

            <ButtonBack
                onPress={() => navigation.goBack()}
            />


            {/* Заголовок */}

            <View style={styles.header}>

                <View>

                    <Text style={styles.heading}>
                        История
                    </Text>

                    <Text style={styles.subtitle}>
                        Недавно прослушанные выпуски
                    </Text>

                </View>


                {history.length > 0 && (

                    <Pressable

                        style={styles.clearButton}

                        onPress={handleClearHistory}

                        disabled={clearing}

                    >

                        {clearing ? (

                            <ActivityIndicator
                                size="small"
                                color={theme.error}
                            />

                        ) : (

                            <Ionicons
                                name="trash-outline"
                                size={21}
                                color={theme.error}
                            />

                        )}

                    </Pressable>

                )}

            </View>


            {/* Список истории */}

            {loading ? (

                <View style={styles.center}>

                    <ActivityIndicator
                        size="large"
                        color={theme.primary}
                    />

                    <Text style={styles.loadingText}>
                        Загружаем историю...
                    </Text>

                </View>

            ) : (

                <FlatList

                    data={history}

                    renderItem={renderItem}

                    keyExtractor={(item) => String(item.id)}

                    contentContainerStyle={[
                        styles.list,
                        history.length === 0 && styles.emptyList,
                    ]}

                    showsVerticalScrollIndicator={false}

                    refreshControl={

                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => loadHistory(true)}
                            tintColor={theme.primary}
                            colors={[theme.primary]}
                        />

                    }

                    ListEmptyComponent={

                        <View style={styles.emptyContainer}>

                            <Ionicons
                                name="time-outline"
                                size={55}
                                color={theme.textMuted}
                            />

                            <Text style={styles.emptyTitle}>
                                История пока пуста
                            </Text>

                            <Text style={styles.emptyText}>
                                Здесь будут отображаться выпуски,
                                которые ты слушал(а).
                            </Text>

                        </View>

                    }

                />

            )}

        </View>

    );

}


function createStyles(theme) {

    return StyleSheet.create({

        container: {
            flex: 1,
            padding: 20,
            backgroundColor: theme.background,
        },

        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 20,
        },

        heading: {
            fontSize: 28,
            fontWeight: 'bold',
            color: theme.text,
        },

        subtitle: {
            fontSize: 13,
            color: theme.textSecondary,
            marginTop: 5,
        },

        clearButton: {
            width: 43,
            height: 43,
            borderRadius: 12,
            backgroundColor: theme.card,
            borderWidth: 1,
            borderColor: theme.cardBorder || theme.surfaceLight,
            justifyContent: 'center',
            alignItems: 'center',
        },

        list: {
            paddingBottom: 30,
        },

        card: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            marginBottom: 12,
            borderRadius: 14,
            backgroundColor: theme.card,
            borderWidth: 1,
            borderColor: theme.cardBorder || theme.surfaceLight,
        },

        cover: {
            width: 70,
            height: 70,
            borderRadius: 10,
        },

        coverPlaceholder: {
            width: 70,
            height: 70,
            borderRadius: 10,
            backgroundColor: theme.surfaceLight,
            justifyContent: 'center',
            alignItems: 'center',
        },

        info: {
            flex: 1,
            marginLeft: 12,
            marginRight: 8,
        },

        podcast: {
            fontSize: 12,
            color: theme.textSecondary,
        },

        title: {
            fontSize: 15,
            fontWeight: 'bold',
            color: theme.text,
            marginTop: 5,
        },

        metadata: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 6,
            gap: 5,
        },

        duration: {
            fontSize: 12,
            color: theme.textSecondary,
        },

        date: {
            fontSize: 11,
            color: theme.textMuted,
            marginTop: 4,
        },

        center: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },

        loadingText: {
            marginTop: 12,
            fontSize: 14,
            color: theme.textSecondary,
        },

        emptyList: {
            flexGrow: 1,
        },

        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 30,
            paddingBottom: 70,
        },

        emptyTitle: {
            fontSize: 19,
            fontWeight: 'bold',
            color: theme.text,
            marginTop: 18,
        },

        emptyText: {
            fontSize: 14,
            color: theme.textSecondary,
            textAlign: 'center',
            lineHeight: 21,
            marginTop: 8,
        },

    });

}
