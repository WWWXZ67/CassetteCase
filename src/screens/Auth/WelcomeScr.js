import React from 'react';

import {
    View,
    Text,
    StyleSheet,
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

export default function WelcomeScr({ navigation }) {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

            <View style={styles.main}>
                <BrandLogo
                    width={270}
                    height={270}
                    style={styles.logo}
                />

                <Text style={styles.description}>
                    Твои любимые подкасты в одном месте
                </Text>

                <View style={styles.buttons}>
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => navigation.navigate('Login')}
                        style={({ pressed }) => [
                            styles.primaryButton,
                            pressed && styles.pressed,
                        ]}
                    >
                        <Text style={styles.primaryButtonText}>Войти</Text>
                    </Pressable>

                    <Pressable
                        accessibilityRole="button"
                        onPress={() => navigation.navigate('Register')}
                        style={({ pressed }) => [
                            styles.secondaryButton,
                            pressed && styles.pressed,
                        ]}
                    >
                        <Text style={styles.secondaryButtonText}>Регистрация</Text>
                    </Pressable>
                </View>
            </View>

            <Text style={styles.footer}>CASSETTE CASE</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25,
        backgroundColor: COLORS.background,
    },
    main: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        marginBottom: 5,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.muted,
        textAlign: 'center',
        marginBottom: 46,
    },
    buttons: {
        width: '100%',
        alignItems: 'center',
        gap: 16,
    },
    primaryButton: {
        width: 170,
        minHeight: 48,
        borderRadius: 12,
        backgroundColor: COLORS.orange,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '700',
    },
    secondaryButton: {
        width: 170,
        minHeight: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.orange,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
    },
    pressed: {
        opacity: 0.78,
        transform: [{ scale: 0.98 }],
    },
    footer: {
        position: 'absolute',
        bottom: 35,
        fontSize: 11,
        letterSpacing: 4,
        color: COLORS.muted,
    },
});
