import React, { useCallback, useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    ActivityIndicator,
    Alert
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import ButtonBack from '../../components/Button/3/ButtonBack';
import ButtonDelete from '../../components/Button/2/ButtonDelete';

import { getFavorites, removeFavorite } from '../../Podcast/Services/FavoritesService';
import { useTheme } from '../../theme';

export default function FavoritesScr({ navigation }) {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState('');

    const loadFavorites = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getFavorites();
            setFavorites(data);
        } catch (err) {
            console.error('Ошибка загрузки избранного:', err);
            setError(
                err.message ||
                'Не удалось загрузить избранное. Проверьте подключение и настройки Supabase.'
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadFavorites();
        }, [loadFavorites])
    );

    const handleDelete = async (episodeId) => {
        if (!episodeId || deletingId) return;

        try {
            setDeletingId(episodeId);
            await removeFavorite(episodeId);
            setFavorites((current) =>
                current.filter((item) => item.id !== episodeId)
            );
        } catch (err) {
            console.error('Ошибка удаления из избранного:', err);
            Alert.alert(
                'Избранное',
                err.message || 'Не удалось удалить выпуск из избранного.'
            );
        } finally {
            setDeletingId(null);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Pressable
                style={styles.info}
                onPress={() => navigation.navigate('Episode', {
                    episodeId: item.id,
                    podcastName: item.podcast
                })}
            >
                <Text style={styles.podcast}>{item.podcast}</Text>
                <Text style={styles.title}>{item.title}</Text>
                {!!item.podcast_author && (
                    <Text style={styles.author}>{item.podcast_author}</Text>
                )}
            </Pressable>

            <View style={styles.deleteButton}>
                <ButtonDelete
                    onPress={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <ButtonBack onPress={() => navigation.goBack()} />

            <Text style={styles.heading}>Избранное</Text>

            {loading ? (
                <View style={styles.status}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={styles.statusText}>Загружаем избранное...</Text>
                </View>
            ) : error ? (
                <View style={styles.status}>
                    <Text style={styles.error}>{error}</Text>
                    <Pressable onPress={loadFavorites} style={styles.retry}>
                        <Text style={styles.retryText}>Повторить</Text>
                    </Pressable>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    renderItem={renderItem}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={
                        favorites.length === 0 ? styles.emptyContent : styles.listContent
                    }
                    ListEmptyComponent={
                        <Text style={styles.empty}>
                            В избранном пока ничего нет.
                        </Text>
                    }
                    showsVerticalScrollIndicator={false}
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
            backgroundColor: theme.surface
        },
        heading: {
            fontSize: 28,
            fontWeight: 'bold',
            color: theme.text,
            marginVertical: 20
        },
        card: {
            padding: 15,
            borderWidth: 1,
            borderColor: theme.surfaceLight,
            borderRadius: 12,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.background
        },
        info: {
            flex: 1,
            paddingRight: 10
        },
        podcast: {
            fontSize: 13,
            color: theme.textSecondary
        },
        title: {
            fontSize: 17,
            color: theme.text,
            fontWeight: 'bold',
            marginTop: 5
        },
        author: {
            fontSize: 13,
            color: theme.textMuted,
            marginTop: 5
        },
        deleteButton: {
            minWidth: 112
        },
        empty: {
            textAlign: 'center',
            color: theme.textMuted,
            marginTop: 40,
            fontSize: 15
        },
        emptyContent: {
            flexGrow: 1
        },
        listContent: {
            paddingBottom: 24
        },
        status: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 12
        },
        statusText: {
            color: theme.textSecondary,
            marginTop: 12
        },
        error: {
            color: theme.error || '#FF5555',
            textAlign: 'center',
            lineHeight: 22
        },
        retry: {
            marginTop: 18,
            paddingHorizontal: 22,
            paddingVertical: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.primary
        },
        retryText: {
            color: theme.primary,
            fontWeight: '600'
        }
    });
}
