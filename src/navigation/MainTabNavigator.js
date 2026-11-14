
import React from 'react';

import {
    View,
    StyleSheet,
} from 'react-native';

import {
    createBottomTabNavigator
} from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Основные страницы
import HomeScr from '../screens/Main/HomeScr';
import LibraryScr from '../screens/Library/LibraryScr';
import ProfileScr from '../screens/Profile/ProfileScr';

// Тема
import { useTheme } from '../theme';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {

    const { theme } = useTheme();

    const insets = useSafeAreaInsets();

    return (

        <Tab.Navigator

            initialRouteName="Home"

            // Safe Area для вкладок библиотеки и профиля.
            // HomeScr уже использует SafeAreaView.
            screenLayout={({ children, route }) => {

                if (route.name === 'Home') {
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

            screenOptions={({ route }) => ({

                headerShown: false,

                tabBarShowLabel: true,

                tabBarStyle: {
                    height: 68 + insets.bottom,

                    paddingTop: 7,
                    paddingBottom: Math.max(insets.bottom, 7),

                    backgroundColor: theme.surface,

                    borderTopColor: theme.surfaceLight,
                    borderTopWidth: 1,

                    elevation: 12,
                },

                tabBarActiveTintColor: theme.primary,

                tabBarInactiveTintColor: theme.silver,

                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 2,
                },

                tabBarIcon: ({ focused, color }) => {

                    let iconName;

                    switch (route.name) {

                        case 'Home':
                            iconName = focused
                                ? 'home'
                                : 'home-outline';
                            break;

                        case 'Library':
                            iconName = focused
                                ? 'library'
                                : 'library-outline';
                            break;

                        case 'Profile':
                            iconName = focused
                                ? 'person-circle'
                                : 'person-circle-outline';
                            break;

                        default:
                            iconName = 'ellipse-outline';

                    }

                    return (

                        <View
                            style={[
                                styles.iconContainer,
                                focused && {
                                    shadowColor: theme.primary,
                                    shadowOpacity: 0.45,
                                    shadowRadius: 9,
                                    shadowOffset: {
                                        width: 0,
                                        height: 0,
                                    },
                                    elevation: 6,
                                },
                            ]}
                        >

                            <Ionicons
                                name={iconName}
                                size={23}
                                color={color}
                            />

                        </View>

                    );

                },

            })}

        >

            <Tab.Screen
                name="Home"
                component={HomeScr}
                options={{
                    tabBarLabel: 'Главная',
                }}
            />

            <Tab.Screen
                name="Library"
                component={LibraryScr}
                options={{
                    tabBarLabel: 'Библиотека',
                }}
            />

            <Tab.Screen
                name="Profile"
                component={ProfileScr}
                options={{
                    tabBarLabel: 'Профиль',
                }}
            />

        </Tab.Navigator>

    );

}

const styles = StyleSheet.create({

    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },

});
