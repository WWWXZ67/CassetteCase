import React, { useState } from 'react';

import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    ScrollView,
    Pressable,
    StatusBar,
} from 'react-native';

import BrandLogo from '../../components/Brand/BrandLogo';
import { AuthService } from '../../Auth/Services/AuthService';

const COLORS = {
    background: '#101114',
    surface: '#191A1F',
    border: '#292A30',
    orange: '#FF7628',
    text: '#FFFFFF',
    muted: '#A1A1AA',
};

export default function RegistrScr({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegistr = async () => {
        if (!name.trim() || !email.trim() || !password || !repeatPassword) {
            Alert.alert('Ошибка', 'Заполните все поля');
            return;
        }

        if (password !== repeatPassword) {
            Alert.alert('Ошибка', 'Пароли не совпадают');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Ошибка', 'Пароль должен содержать минимум 6 символов');
            return;
        }

        if (loading) return;

        try {
            setLoading(true);

            const data = await AuthService.register(
                email.trim().toLowerCase(),
                password,
                name.trim()
            );

            if (data.session) {
                Alert.alert('Успешно', 'Аккаунт Cassette Case создан!');
            } else {
                Alert.alert(
                    'Почти готово!',
                    'Мы отправили письмо для подтверждения электронной почты. Проверьте почту и подтвердите аккаунт.'
                );
                navigation.navigate('Login');
            }
        } catch (error) {
            let message = error.message || 'Не удалось зарегистрироваться';

            if (message.includes('already registered')) {
                message = 'Пользователь с такой почтой уже зарегистрирован';
            } else if (message.includes('Password')) {
                message = 'Пароль не соответствует требованиям';
            }

            Alert.alert('Ошибка регистрации', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Назад"
                onPress={() => navigation.goBack()}
                style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            >
                <Text style={styles.backButtonText}>‹  Назад</Text>
            </Pressable>

            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <BrandLogo width={155} height={155} style={styles.logo} />

                <Text style={styles.title}>Регистрация</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Имя пользователя"
                    placeholderTextColor={COLORS.muted}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    textContentType="name"
                    selectionColor={COLORS.orange}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Электронная почта"
                    placeholderTextColor={COLORS.muted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                    selectionColor={COLORS.orange}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Пароль"
                    placeholderTextColor={COLORS.muted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    selectionColor={COLORS.orange}
                    textContentType="newPassword"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Повторите пароль"
                    placeholderTextColor={COLORS.muted}
                    value={repeatPassword}
                    onChangeText={setRepeatPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    selectionColor={COLORS.orange}
                    textContentType="newPassword"
                />

                <Pressable
                    accessibilityRole="button"
                    onPress={handleRegistr}
                    disabled={loading}
                    style={({ pressed }) => [
                        styles.primaryButton,
                        (pressed || loading) && styles.buttonPressed,
                    ]}
                >
                    <Text style={styles.primaryButtonText}>
                        {loading ? 'Создаём аккаунт…' : 'Регистрация'}
                    </Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingHorizontal: 25,
        paddingTop: 10,
    },
    backButton: {
        width: 100,
        height: 42,
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderRadius: 12,
    },
    backButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 25,
    },
    logo: {
        marginBottom: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 25,
    },
    input: {
        minHeight: 50,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        color: COLORS.text,
        backgroundColor: COLORS.surface,
        fontSize: 15,
    },
    primaryButton: {
        minHeight: 48,
        borderRadius: 12,
        backgroundColor: COLORS.orange,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginTop: 5,
    },
    primaryButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '700',
    },
    pressed: {
        opacity: 0.75,
    },
    buttonPressed: {
        opacity: 0.75,
    },
});
