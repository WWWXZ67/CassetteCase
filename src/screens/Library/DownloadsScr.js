import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    Alert,
    ActivityIndicator,
} from 'react-native';
import ButtonBack from '../../components/Button/3/ButtonBack';
import ButtonDelete from '../../components/Button/2/ButtonDelete';
import { useTheme } from '../../theme';
import { getDownloads, deleteDownload } from '../../Podcast/Services/DownloadsService';

export default function DownloadsScr({ navigation }) {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [downloads, setDownloads] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadDownloads = useCallback(async () => {
        try {
            setLoading(true);
            setDownloads(await getDownloads());
        } catch (error) {
            console.error('Ошибка загрузки списка скачанных выпусков:', error);
            Alert.alert('Загрузки', error.message || 'Не удалось загрузить список скачанных выпусков.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadDownloads);
        loadDownloads();
        return unsubscribe;
    }, [navigation, loadDownloads]);

    const handleDelete = (item) => {
        Alert.alert(
            'Удалить загрузку?',
            `«${item.title}» будет удалён с устройства.`,
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteDownload(item.id);
                            setDownloads(current => current.filter(entry => String(entry.id) !== String(item.id)));
                        } catch (error) {
                            Alert.alert('Ошибка', error.message || 'Не удалось удалить файл.');
                        }
                    },
                },
            ]
        );
    };

    const formatDuration = (seconds) => {
        if (!seconds) return 'Продолжительность неизвестна';
        const minutes = Math.floor(Number(seconds) / 60);
        const remaining = Math.floor(Number(seconds) % 60);
        return `${minutes}:${String(remaining).padStart(2, '0')}`;
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Pressable
                style={styles.info}
                onPress={() => navigation.navigate('Player', {
                    episodeId: item.id,
                    episodeTitle: item.title,
                    podcastName: item.podcast,
                    audioUrl: item.localUri,
                    coverUrl: item.cover_url,
                    duration: item.duration,
                })}
            >
                <Text style={styles.podcast}>{item.podcast}</Text>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.duration}>{formatDuration(item.duration)}</Text>
                <Text style={styles.offline}>Доступен офлайн</Text>
            </Pressable>
            <ButtonDelete onPress={() => handleDelete(item)} />
        </View>
    );

    return (
        <View style={styles.container}>
            <ButtonBack onPress={() => navigation.goBack()} />
            <Text style={styles.heading}>Загрузки</Text>
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            ) : (
                <FlatList
                    data={downloads}
                    renderItem={renderItem}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={downloads.length === 0 ? styles.emptyContent : undefined}
                    ListEmptyComponent={<Text style={styles.empty}>Загруженных выпусков пока нет.</Text>}
                />
            )}
        </View>
    );
}

function createStyles(theme) {
    return StyleSheet.create({
        container: { flex: 1, padding: 20, backgroundColor: theme.surface },
        heading: { fontSize: 28, fontWeight: 'bold', color: theme.text, marginVertical: 20 },
        card: {
            padding: 15, borderWidth: 1, borderColor: theme.surfaceLight,
            borderRadius: 10, marginBottom: 12, flexDirection: 'row', alignItems: 'center',
        },
        info: { flex: 1 },
        podcast: { fontSize: 13, color: theme.textSecondary },
        title: { fontSize: 17, color: theme.text, fontWeight: 'bold', marginTop: 5 },
        duration: { fontSize: 13, color: theme.textSecondary, marginTop: 5 },
        offline: { fontSize: 12, color: theme.primary, marginTop: 6 },
        empty: { textAlign: 'center', color: theme.textMuted, marginTop: 40 },
        emptyContent: { flexGrow: 1 },
        center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    });
}
