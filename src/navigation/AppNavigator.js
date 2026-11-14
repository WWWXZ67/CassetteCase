
import React from 'react';

import {
    NavigationContainer,
    DefaultTheme,
    DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';

import {
    createNativeStackNavigator
} from '@react-navigation/native-stack';

import { SafeAreaView } from 'react-native-safe-area-context';

// Авторизация
import AuthNavigator from './AuthNavigator';
import { useAuth } from '../Auth/Context/AuthContext';

// Тема
import { useTheme } from '../theme';

// Основная навигация
import MainTabNavigator from './MainTabNavigator';

// Main
import SearchScr from '../screens/Main/SearchScr';
import PodcastScr from '../screens/Main/PodcastScr';
import EpisodeScr from '../screens/Main/EpisodeScr';
import PlayerScr from '../screens/Main/PlayerScr';

// Library
import FavoritesScr from '../screens/Library/FavoritesScr';
import DownloadsScr from '../screens/Library/DownloadsScr';
import HistoryScr from '../screens/Library/HistoryScr';
import QueueScr from '../screens/Library/QueueScr';

// Profile
import EditProfileScr from '../screens/Profile/EditProfileScr';
import AccountScr from '../screens/Profile/AccountScr';
import SettingsScr from '../screens/Profile/SettingsScr';

// Service
import DowlandScr from '../screens/DowlandScr';
import ErrorScr from '../screens/ErrorScr';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {

    const { isAuthenticated, loading } = useAuth();

    const { theme, isDark } = useTheme();

    // Тема React Navigation
    const navigationTheme = {
        ...(isDark ? NavigationDarkTheme : DefaultTheme),

        colors: {
            ...(isDark
                ? NavigationDarkTheme.colors
                : DefaultTheme.colors
            ),

            primary: theme.primary,
            background: theme.background,
            card: theme.surface,
            text: theme.text,
            border: theme.surfaceLight,
            notification: theme.primary,
        },
    };

    return (

        <NavigationContainer theme={navigationTheme}>

            <Stack.Navigator

                screenOptions={{
                    headerShown: false,
                    animation: 'fade',

                    contentStyle: {
                        backgroundColor: theme.background,
                    },
                }}

                // Безопасная область для всех дополнительных экранов.
                // Главная вкладка обрабатывает её самостоятельно.
                screenLayout={({ children, route }) => {

                    if (route.name === 'Main') {
                        return children;
                    }

                    return (
                        <SafeAreaView
                            style={{ flex: 1 }}
                            edges={['top']}
                        >
                            {children}
                        </SafeAreaView>
                    );

                }}

            >

                {/* Проверка авторизации */}

                {loading ? (

                    <Stack.Screen
                        name="Loading"
                        component={DowlandScr}
                    />

                ) : !isAuthenticated ? (

                    /* Авторизация */

                    <Stack.Screen
                        name="Auth"
                        component={AuthNavigator}
                    />

                ) : (

                    /* Основное приложение */

                    <>

                        <Stack.Screen
                            name="Main"
                            component={MainTabNavigator}
                        />

                        {/* Main */}

                        <Stack.Screen
                            name="Search"
                            component={SearchScr}
                        />

                        <Stack.Screen
                            name="Podcast"
                            component={PodcastScr}
                        />

                        <Stack.Screen
                            name="Episode"
                            component={EpisodeScr}
                        />

                        <Stack.Screen
                            name="Player"
                            component={PlayerScr}
                        />

                        {/* Library */}

                        <Stack.Screen
                            name="Favorites"
                            component={FavoritesScr}
                        />

                        <Stack.Screen
                            name="Downloads"
                            component={DownloadsScr}
                        />

                        <Stack.Screen
                            name="History"
                            component={HistoryScr}
                        />

                        <Stack.Screen
                            name="Queue"
                            component={QueueScr}
                        />

                        {/* Profile */}

                        <Stack.Screen
                            name="EditProfile"
                            component={EditProfileScr}
                        />

                        <Stack.Screen
                            name="Account"
                            component={AccountScr}
                        />

                        <Stack.Screen
                            name="Settings"
                            component={SettingsScr}
                        />

                        {/* Error */}

                        <Stack.Screen
                            name="Error"
                            component={ErrorScr}
                        />

                    </>

                )}

            </Stack.Navigator>

        </NavigationContainer>

    );

}
