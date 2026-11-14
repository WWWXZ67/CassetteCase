import React, { useState } from 'react';

import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    Pressable,
    StatusBar,
} from 'react-native';

import BrandLogo from '../../components/Brand/BrandLogo';

const COLORS = {
    background: '#101114',
    surface: '#191A1F',
    border: '#292A30',
    orange: '#FF7628',
    text: '#FFFFFF',
    muted: '#A1A1AA',
};

export default function ForgotPasswordScr({ navigation }) {
    const [email, setEmail] = useState('');

    const handleReset = () => {
        if (!email.trim()) {
            Alert.alert('Ошибка', 'Введите электронную почту');
            return;
        }

        Alert.alert(
            'Восстановление пароля',
            'Функция отправки письма будет подключена позже.'
        );
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

            <View style={styles.content}>
                <BrandLogo width={140} height={140} style={styles.logo} />

                <Text style={styles.title}>Восстановление пароля</Text>

                <Text style={styles.description}>
                    Введите электронную почту, указанную при регистрации.
                </Text>

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

                <Pressable
                    accessibilityRole="button"
                    onPress={handleReset}
                    style={({ pressed }) => [
                        styles.primaryButton,
                        pressed && styles.buttonPressed,
                    ]}
                >
                    <Text style={styles.primaryButtonText}>Отправить</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 25,
        paddingTop: 10,
        backgroundColor: COLORS.background,
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
        flex: 1,
        justifyContent: 'center',
    },
    logo: {
        marginBottom: 10,
    },
    title: {
        fontSize: 25,
        lineHeight: 32,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 20,
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        color: COLORS.muted,
        textAlign: 'center',
        marginBottom: 25,
    },
    input: {
        minHeight: 50,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
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
