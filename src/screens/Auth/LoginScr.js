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

export default function LoginScr({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail || !password) {
            Alert.alert('Ошибка', 'Заполните электронную почту и пароль');
            return;
        }

        if (loading) return;

        try {
            setLoading(true);

            const data = await AuthService.login(normalizedEmail, password);

            if (!data?.session || !data?.user) {
                Alert.alert(
                    'Вход не выполнен',
                    'Не удалось создать сессию. Попробуйте ещё раз.'
                );
                return;
            }
        } catch (error) {
            console.error('Ошибка входа:', error);

            const errorCode = error?.code;
            const errorMessage = error?.message || '';

            if (
                errorCode === 'email_not_confirmed' ||
                errorMessage === 'Email not confirmed'
            ) {
                Alert.alert(
                    'Почта не подтверждена',
                    'Подтвердите электронную почту по ссылке из письма.'
                );
            } else if (
                errorCode === 'invalid_credentials' ||
                errorMessage === 'Invalid login credentials'
            ) {
                Alert.alert(
                    'Ошибка входа',
                    'Неверная электронная почта или пароль.'
                );
            } else if (errorCode === 'user_not_found') {
                Alert.alert(
                    'Аккаунт не найден',
                    'Проверьте электронную почту или зарегистрируйтесь.'
                );
            } else {
                Alert.alert(
                    'Ошибка входа',
                    'Не удалось выполнить вход. Попробуйте ещё раз.'
                );
            }
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
                <BrandLogo width={190} height={190} style={styles.logo} />

                <Text style={styles.title}>Вход</Text>

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
                    autoCorrect={false}
                    textContentType="password"
                    selectionColor={COLORS.orange}
                />

                <Pressable
                    accessibilityRole="button"
                    onPress={() => navigation.navigate('ForgotPassword')}
                    style={({ pressed }) => pressed && styles.textPressed}
                >
                    <Text style={styles.forgot}>Забыли пароль?</Text>
                </Pressable>

                <Pressable
                    accessibilityRole="button"
                    onPress={handleLogin}
                    disabled={loading}
                    style={({ pressed }) => [
                        styles.primaryButton,
                        (pressed || loading) && styles.buttonPressed,
                    ]}
                >
                    <Text style={styles.primaryButtonText}>
                        {loading ? 'Входим…' : 'Войти'}
                    </Text>
                </Pressable>

                <Pressable
                    accessibilityRole="button"
                    onPress={() => navigation.navigate('Register')}
                    style={({ pressed }) => pressed && styles.textPressed}
                >
                    <Text style={styles.registerText}>
                        Нет аккаунта? <Text style={styles.registerAccent}>Зарегистрироваться</Text>
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
        marginBottom: 30,
        textAlign: 'center',
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
    forgot: {
        fontSize: 14,
        color: COLORS.orange,
        textAlign: 'right',
        marginBottom: 25,
        paddingVertical: 4,
    },
    primaryButton: {
        minHeight: 48,
        borderRadius: 12,
        backgroundColor: COLORS.orange,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    primaryButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '700',
    },
    registerText: {
        fontSize: 14,
        color: COLORS.muted,
        textAlign: 'center',
        marginTop: 25,
    },
    registerAccent: {
        color: COLORS.orange,
        fontWeight: '600',
    },
    pressed: {
        opacity: 0.75,
    },
    textPressed: {
        opacity: 0.7,
    },
    buttonPressed: {
        opacity: 0.75,
    },
});
