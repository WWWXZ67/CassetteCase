import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    Alert,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ButtonBack from '../../components/Button/3/ButtonBack';
import { useAuth } from '../../Auth/Context/AuthContext';
import { useTheme } from '../../theme';

export default function ProfileScr({ navigation }) {
    const { user, profile, signOut } = useAuth();
    const { theme } = useTheme();
    const [loggingOut, setLoggingOut] = useState(false);
    const styles = createStyles(theme);

    const profileName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ')
        || user?.user_metadata?.full_name || user?.user_metadata?.name || profile?.username || user?.user_metadata?.username || 'Имя пользователя';
    const profileEmail = user?.email || '';
    const username = profile?.username || user?.user_metadata?.username;
    const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

    const sections = [
        { title: 'Редактировать профиль', icon: 'create-outline', screen: 'EditProfile' },
        { title: 'Аккаунт', icon: 'person-outline', screen: 'Account' },
        { title: 'Настройки', icon: 'settings-outline', screen: 'Settings' },
    ];

    const performLogout = async () => {
        if (loggingOut) return;
        setLoggingOut(true);
        try {
            const { error } = await signOut();
            if (error) Alert.alert('Ошибка', 'Не удалось выйти из аккаунта. Попробуйте ещё раз.');
        } catch (error) {
            console.error('Ошибка выхода:', error);
            Alert.alert('Ошибка', 'Произошла ошибка при выходе из аккаунта.');
        } finally {
            setLoggingOut(false);
        }
    };

    const handleLogout = () => Alert.alert(
        'Выход из аккаунта',
        'Вы действительно хотите выйти из своего профиля?',
        [
            { text: 'Отмена', style: 'cancel' },
            { text: 'Выйти', style: 'destructive', onPress: performLogout },
        ]
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <ButtonBack onPress={() => navigation.goBack()} />
            <Text style={styles.heading}>Профиль</Text>

            <View style={styles.profile}>
                <View style={styles.avatar}>
                    {avatarUrl ? <Image source={{ uri: avatarUrl }} style={styles.avatarImage} /> : <Ionicons name="person-outline" size={45} color={theme.primary} />}
                </View>
                <Text style={styles.name}>{profileName}</Text>
                {username ? <Text style={styles.username}>@{username}</Text> : null}
                <Text style={styles.email}>{profileEmail}</Text>
            </View>

            <View style={styles.sections}>
                {sections.map((item) => (
                    <Pressable key={item.screen} style={({ pressed }) => [styles.section, pressed && styles.sectionPressed]} onPress={() => navigation.navigate(item.screen)}>
                        <View style={styles.sectionLeft}>
                            <Ionicons name={item.icon} size={23} color={theme.primary} />
                            <Text style={styles.sectionText}>{item.title}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.silver} />
                    </Pressable>
                ))}
            </View>

            <Pressable style={({ pressed }) => [styles.logout, pressed && styles.logoutPressed, loggingOut && styles.logoutDisabled]} onPress={handleLogout} disabled={loggingOut}>
                <Ionicons name="log-out-outline" size={21} color={theme.error} />
                <Text style={styles.logoutText}>{loggingOut ? 'Выходим...' : 'Выйти из аккаунта'}</Text>
            </Pressable>
        </ScrollView>
    );
}

function createStyles(theme) {
    return StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        content: { padding: 20, paddingBottom: 40 },
        heading: { fontSize: 28, fontWeight: 'bold', color: theme.text, marginVertical: 20 },
        profile: { alignItems: 'center', marginVertical: 25 },
        avatar: { width: 110, height: 110, borderRadius: 55, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 15, overflow: 'hidden' },
        avatarImage: { width: '100%', height: '100%' },
        name: { fontSize: 22, fontWeight: 'bold', color: theme.text },
        username: { fontSize: 14, color: theme.primary, marginTop: 5 },
        email: { fontSize: 14, color: theme.textSecondary, marginTop: 7 },
        sections: { marginTop: 20 },
        section: { padding: 18, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.surfaceLight, borderRadius: 14, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: 13 },
        sectionPressed: { opacity: 0.7, borderColor: theme.primary },
        sectionText: { fontSize: 16, color: theme.text, fontWeight: '500' },
        logout: { padding: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 25, borderWidth: 1, borderColor: theme.error, borderRadius: 14 },
        logoutPressed: { opacity: 0.7 },
        logoutDisabled: { opacity: 0.5 },
        logoutText: { fontSize: 16, fontWeight: '600', color: theme.error },
    });
}
