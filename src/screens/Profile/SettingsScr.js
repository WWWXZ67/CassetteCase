
import React, { useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Switch,
    Pressable,
} from 'react-native';

import ButtonBack from '../../components/Button/3/ButtonBack';

import { useTheme } from '../../theme';

export default function SettingsScr({ navigation }) {

    const {
        theme,
        themeMode,
        setThemeMode,
        isDark
    } = useTheme();

    const [autoPlay, setAutoPlay] = useState(true);
    const [mobileInternet, setMobileInternet] = useState(false);
    const [notifications, setNotifications] = useState(true);

    const styles = createStyles(theme);

    const renderSwitch = (title, value, onChange) => (

        <View style={styles.setting}>

            <Text style={styles.settingText}>
                {title}
            </Text>

            <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{
                    false: theme.silver,
                    true: theme.primary
                }}
                thumbColor="#FFFFFF"
            />

        </View>

    );

    const renderThemeOption = (mode, title, description) => {

        const selected = themeMode === mode;

        return (

            <Pressable
                key={mode}
                style={[
                    styles.themeOption,
                    selected && styles.themeOptionSelected
                ]}
                onPress={() => setThemeMode(mode)}
            >

                <View style={styles.themeOptionInfo}>

                    <Text style={styles.themeOptionTitle}>
                        {title}
                    </Text>

                    <Text style={styles.themeOptionDescription}>
                        {description}
                    </Text>

                </View>

                <View style={[
                    styles.radio,
                    selected && styles.radioSelected
                ]}>

                    {selected && (
                        <View style={styles.radioInner} />
                    )}

                </View>

            </Pressable>

        );

    };

    const renderLink = (title, onPress) => (

        <Pressable
            style={styles.setting}
            onPress={onPress}
        >

            <Text style={styles.settingText}>
                {title}
            </Text>

            <Text style={styles.arrow}>
                →
            </Text>

        </Pressable>

    );

    return (

        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >

        <ButtonBack
            onPress={() => navigation.navigate('Main', {
              screen: 'Profile'
            })}
        />

            <Text style={styles.heading}>
                Настройки
            </Text>

            {/* ВОСПРОИЗВЕДЕНИЕ */}

            <Text style={styles.subtitle}>
                Воспроизведение
            </Text>

            {renderSwitch(
                'Автоматически следующий выпуск',
                autoPlay,
                setAutoPlay
            )}

            {renderSwitch(
                'Использовать мобильный интернет',
                mobileInternet,
                setMobileInternet
            )}

            {/* ИНТЕРФЕЙС */}

            <Text style={styles.subtitle}>
                Интерфейс
            </Text>

            <Text style={styles.sectionDescription}>
                Выбери оформление Cassette Case
            </Text>

            <View style={styles.themeContainer}>

                {renderThemeOption(
                    'light',
                    'Светлая тема',
                    'Светлое оформление приложения'
                )}

                {renderThemeOption(
                    'dark',
                    'Тёмная тема',
                    'Тёмное оформление приложения'
                )}

                {renderThemeOption(
                    'system',
                    'Системная',
                    'Как на устройстве'
                )}

            </View>

            {renderSwitch(
                'Уведомления',
                notifications,
                setNotifications
            )}

            {/* ДОПОЛНИТЕЛЬНО */}

            <Text style={styles.subtitle}>
                Дополнительно
            </Text>

            {renderLink(
                'Конфиденциальность',
                () => {}
            )}

            {renderLink(
                'О приложении',
                () => {}
            )}

            <Text style={styles.version}>
                Cassette Case — версия 1.0.0
            </Text>

        </ScrollView>

    );

}

function createStyles(theme) {

    return StyleSheet.create({

        container: {
            flex: 1,
            backgroundColor: theme.background,
        },

        content: {
            padding: 20,
            paddingBottom: 40,
        },

        heading: {
            fontSize: 28,
            fontWeight: 'bold',
            color: theme.text,
            marginVertical: 20,
        },

        subtitle: {
            fontSize: 19,
            fontWeight: 'bold',
            color: theme.text,
            marginTop: 25,
            marginBottom: 12,
        },

        sectionDescription: {
            fontSize: 13,
            color: theme.textSecondary,
            marginBottom: 12,
        },

        setting: {
            minHeight: 55,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.surfaceLight,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },

        settingText: {
            fontSize: 15,
            color: theme.text,
            flex: 1,
        },

        themeContainer: {
            backgroundColor: theme.surface,
            borderRadius: 14,
            paddingHorizontal: 14,
            borderWidth: 1,
            borderColor: theme.surfaceLight,
        },

        themeOption: {
            minHeight: 72,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: theme.surfaceLight,
            paddingVertical: 12,
        },

        themeOptionSelected: {
            borderLeftWidth: 3,
            borderLeftColor: theme.primary,
            paddingLeft: 10,
        },

        themeOptionInfo: {
            flex: 1,
        },

        themeOptionTitle: {
            fontSize: 15,
            fontWeight: '600',
            color: theme.text,
        },

        themeOptionDescription: {
            fontSize: 12,
            color: theme.textSecondary,
            marginTop: 5,
        },

        radio: {
            width: 22,
            height: 22,
            borderRadius: 11,
            borderWidth: 2,
            borderColor: theme.silver,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 12,
        },

        radioSelected: {
            borderColor: theme.primary,
        },

        radioInner: {
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: theme.primary,
        },

        arrow: {
            fontSize: 18,
            color: theme.textSecondary,
        },

        version: {
            textAlign: 'center',
            color: theme.textMuted,
            fontSize: 13,
            marginVertical: 40,
        },

    });

}
