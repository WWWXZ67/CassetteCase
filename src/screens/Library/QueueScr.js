import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ButtonBack from '../../components/Button/3/ButtonBack';
import ButtonDelete from '../../components/Button/2/ButtonDelete';
import { useTheme } from '../../theme';
import { useQueue } from '../../Podcast/Context/QueueContext';

export default function QueueScr({ navigation }) {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { queue, loading, removeFromQueue, clearQueue, moveInQueue } = useQueue();

    const handleClear = () => {
        if (!queue.length) return;
        Alert.alert('Очистить очередь?', 'Все выпуски будут удалены из очереди.', [
            { text: 'Отмена', style: 'cancel' },
            { text: 'Очистить', style: 'destructive', onPress: clearQueue }
        ]);
    };

    const playItem = (item) => {
        if (!item.audio_url) {
            Alert.alert('Не удалось воспроизвести', 'У этого выпуска отсутствует ссылка на аудио.');
            return;
        }
        removeFromQueue(item.id);
        navigation.navigate('Player', {
            episodeId: item.id,
            episodeTitle: item.title,
            podcastName: item.podcast,
            audioUrl: item.audio_url,
            coverUrl: item.cover_url,
            duration: item.duration
        });
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.card}>
            <Text style={styles.number}>{index + 1}.</Text>
            <Pressable style={styles.info} onPress={() => playItem(item)}>
                <Text style={styles.podcast}>{item.podcast}</Text>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.playHint}>Нажмите, чтобы воспроизвести</Text>
            </Pressable>
            <View style={styles.orderControls}>
                <Pressable disabled={index === 0} onPress={() => moveInQueue(item.id, -1)} style={styles.orderButton}>
                    <Ionicons name="chevron-up" size={20} color={index === 0 ? theme.textMuted : theme.primary} />
                </Pressable>
                <Pressable disabled={index === queue.length - 1} onPress={() => moveInQueue(item.id, 1)} style={styles.orderButton}>
                    <Ionicons name="chevron-down" size={20} color={index === queue.length - 1 ? theme.textMuted : theme.primary} />
                </Pressable>
            </View>
            <ButtonDelete onPress={() => removeFromQueue(item.id)} />
        </View>
    );

    return (
        <View style={styles.container}>
            <ButtonBack onPress={() => navigation.goBack()} />
            <Text style={styles.heading}>Очередь воспроизведения</Text>
            <View style={styles.topRow}>
                <Text style={styles.count}>Выпусков: {queue.length}</Text>
                <Pressable onPress={handleClear} disabled={!queue.length}>
                    <Text style={[styles.clearText, !queue.length && styles.disabledText]}>Очистить очередь</Text>
                </Pressable>
            </View>
            <FlatList
                data={queue}
                renderItem={renderItem}
                keyExtractor={item => String(item.id)}
                extraData={queue}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text style={styles.empty}>{loading ? 'Загружаем очередь...' : 'Очередь воспроизведения пуста. Добавьте выпуски со страницы подкаста.'}</Text>}
            />
        </View>
    );
}

function createStyles(theme) {
    return StyleSheet.create({
        container: { flex: 1, padding: 20, backgroundColor: theme.surface },
        heading: { fontSize: 26, fontWeight: 'bold', color: theme.text, marginVertical: 20 },
        topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
        count: { fontSize: 13, color: theme.textSecondary },
        clearText: { fontSize: 14, color: '#FF7628', fontWeight: '600' },
        card: { padding: 12, borderWidth: 1, borderColor: theme.surfaceLight, borderRadius: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
        number: { fontSize: 16, color: theme.textSecondary, marginRight: 10 },
        info: { flex: 1 },
        podcast: { fontSize: 13, color: theme.textSecondary },
        title: { fontSize: 15, color: theme.text, fontWeight: 'bold', marginTop: 5 },
        playHint: { fontSize: 11, color: theme.primary, marginTop: 5 },
        orderControls: { marginHorizontal: 5, alignItems: 'center' },
        orderButton: { paddingHorizontal: 7, paddingVertical: 3 },
        disabledText: { opacity: 0.3 },
        empty: { textAlign: 'center', color: theme.textMuted, marginTop: 40, lineHeight: 22 }
    });
}
