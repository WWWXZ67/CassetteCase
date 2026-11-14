import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import ButtonBack from '../../components/Button/3/ButtonBack';
import { useTheme } from '../../theme';

export default function LibraryScr({ navigation }) {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const sections = [
        {
            title: 'Избранное',
            description: 'Любимые выпуски',
            icon: 'heart-outline',
            screen: 'Favorites'
        },
        {
            title: 'Загрузки',
            description: 'Скачанные выпуски',
            icon: 'download-outline',
            screen: 'Downloads'
        },
        {
            title: 'История',
            description: 'Ранее прослушанные выпуски',
            icon: 'time-outline',
            screen: 'History'
        },
        {
            title: 'Очередь',
            description: 'Очередь воспроизведения',
            icon: 'list-outline',
            screen: 'Queue'
        },
    ];

    return (
        <View style={styles.container}>
            <ButtonBack onPress={() => navigation.goBack()} />
            <Text style={styles.title}>Библиотека</Text>
            <ScrollView>
                {sections.map((item) => (
                    <Pressable
                        key={item.screen}
                        style={({ pressed }) => [styles.section, pressed && styles.sectionPressed]}
                        onPress={() => navigation.navigate(item.screen)}
                    >
                        <View style={styles.sectionLeft}>
                            <View style={styles.iconContainer}>
                                <Ionicons name={item.icon} size={25} color={theme.primary} />
                            </View>
                            <View style={styles.sectionContent}>
                                <Text style={styles.sectionTitle}>{item.title}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.silver} />
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}

function createStyles(theme) {
    return StyleSheet.create({
        container: { flex: 1, padding: 20, backgroundColor: theme.background },
        title: { fontSize: 28, fontWeight: 'bold', color: theme.text, marginVertical: 20 },
        section: {
            padding: 16,
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.surfaceLight,
            borderRadius: 14,
            marginBottom: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        sectionPressed: { borderColor: theme.primary, opacity: 0.8 },
        sectionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
        iconContainer: {
            width: 43, height: 43, borderRadius: 12,
            backgroundColor: theme.surfaceLight,
            justifyContent: 'center', alignItems: 'center', marginRight: 13,
        },
        sectionContent: { flex: 1 },
        sectionTitle: { fontSize: 17, fontWeight: 'bold', color: theme.text },
        description: { fontSize: 13, color: theme.textSecondary, marginTop: 5 },
    });
}
