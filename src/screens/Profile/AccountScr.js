import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ButtonBack from '../../components/Button/3/ButtonBack';
import { useAuth } from '../../Auth/Context/AuthContext';
import { useTheme } from '../../theme';

export default function AccountScr({ navigation }) {
    const { user, profile } = useAuth();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const registrationDate = user?.created_at
        ? new Date(user.created_at).toLocaleDateString('ru-RU')
        : '—';

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <ButtonBack onPress={() => navigation.goBack()} />
            <Text style={styles.heading}>Аккаунт</Text>

            <View style={styles.info}>
                <Text style={styles.label}>Электронная почта</Text>
                <Text style={styles.value}>{user?.email || '—'}</Text>

                <Text style={styles.label}>Никнейм</Text>
                <Text style={styles.value}>{profile?.username ? `@${profile.username}` : (user?.user_metadata?.username ? `@${user.user_metadata.username}` : 'Не указан')}</Text>

                <Text style={styles.label}>Дата регистрации</Text>
                <Text style={styles.value}>{registrationDate}</Text>
            </View>

            <Text style={styles.subtitle}>Управление аккаунтом</Text>
            <Pressable style={styles.button} onPress={() => navigation.navigate('EditProfile')}>
                <View style={styles.buttonLeft}>
                    <Ionicons name="person-circle-outline" size={22} color={theme.primary} />
                    <Text style={styles.buttonText}>Изменить данные профиля</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.silver} />
            </Pressable>

            <Text style={styles.note}>Здесь можно изменить имя, фамилию, никнейм и фотографию профиля.</Text>
        </ScrollView>
    );
}

function createStyles(theme) {
    return StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        content: { padding: 20, paddingBottom: 40 },
        heading: { fontSize: 28, fontWeight: 'bold', color: theme.text, marginVertical: 20 },
        info: { padding: 18, borderWidth: 1, borderColor: theme.surfaceLight, borderRadius: 12, backgroundColor: theme.surface },
        label: { fontSize: 13, color: theme.textSecondary, marginTop: 12 },
        value: { fontSize: 16, color: theme.text, marginTop: 5 },
        subtitle: { fontSize: 20, fontWeight: 'bold', color: theme.text, marginTop: 30, marginBottom: 15 },
        button: { padding: 17, borderWidth: 1, borderColor: theme.surfaceLight, borderRadius: 12, marginBottom: 12, backgroundColor: theme.surface, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        buttonLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
        buttonText: { fontSize: 15, color: theme.text },
        note: { color: theme.textSecondary, fontSize: 13, lineHeight: 19, marginTop: 5 },
    });
}
