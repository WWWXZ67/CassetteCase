import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    StatusBar,
} from 'react-native';

const COLORS = {
    background: '#101114',
    surface: '#191A1F',
    border: '#292A30',
    orange: '#FF7628',
    text: '#FFFFFF',
    muted: '#A1A1AA',
};

export default function ErrorScr({ navigation, route }) {
    const errorImage = route?.params?.imageSource;
    const errorMessage = route?.params?.message || 'Возникла ошибка. Попробуйте ещё раз.';

    const handleBack = () => {
        if (navigation?.canGoBack?.()) {
            navigation.goBack();
        } else {
            navigation?.navigate?.('Main');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

            <Text style={styles.title}>Ой! Зажевало…</Text>

            <Text style={styles.subtitle}>{errorMessage}</Text>

            <View style={styles.imageContainer}>
                {errorImage ? (
                    <Image
                        source={errorImage}
                        style={styles.image}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Text style={styles.placeholderMark}>C</Text>
                        <Text style={styles.placeholderText}>CASCAS</Text>
                    </View>
                )}
            </View>

            <Pressable
                accessibilityRole="button"
                onPress={handleBack}
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                ]}
            >
                <Text style={styles.buttonText}>Вернуться назад</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25,
    },
    title: {
        fontSize: 28,
        lineHeight: 35,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 23,
        color: COLORS.muted,
        marginTop: 10,
        textAlign: 'center',
        maxWidth: 300,
    },
    imageContainer: {
        width: 250,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 28,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderMark: {
        color: COLORS.orange,
        fontSize: 100,
        fontWeight: '800',
        lineHeight: 112,
    },
    placeholderText: {
        color: COLORS.muted,
        fontSize: 12,
        letterSpacing: 5,
        marginTop: 4,
    },
    button: {
        minWidth: 190,
        minHeight: 48,
        paddingHorizontal: 22,
        borderRadius: 12,
        backgroundColor: COLORS.orange,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: COLORS.text,
        fontSize: 15,
        fontWeight: '700',
    },
    buttonPressed: {
        opacity: 0.78,
    },
});
