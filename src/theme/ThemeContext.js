
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { LightTheme } from './lightTheme';
import { DarkTheme } from './darkTheme';

const ThemeContext = createContext(null);

const STORAGE_KEY = '@cassette_case_theme';

export function ThemeProvider({ children }) {

    const systemScheme = useColorScheme();

    const [themeMode, setThemeMode] = useState('system');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        async function loadTheme() {
            try {
                const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);

                if (
                    savedTheme === 'light' ||
                    savedTheme === 'dark' ||
                    savedTheme === 'system'
                ) {
                    setThemeMode(savedTheme);
                }
            } catch (error) {
                console.error('Ошибка загрузки темы:', error);
            } finally {
                setIsLoaded(true);
            }
        }

        loadTheme();
    }, []);

    const changeTheme = async (mode) => {

        if (!['light', 'dark', 'system'].includes(mode)) {
            return;
        }

        setThemeMode(mode);

        try {
            await AsyncStorage.setItem(STORAGE_KEY, mode);
        } catch (error) {
            console.error('Ошибка сохранения темы:', error);
        }
    };

    const isDark =
        themeMode === 'system'
            ? systemScheme === 'dark'
            : themeMode === 'dark';

    const theme = isDark ? DarkTheme : LightTheme;

    if (!isLoaded) {
        return null;
    }

    return (
        <ThemeContext.Provider
            value={{
                theme,
                themeMode,
                setThemeMode: changeTheme,
                isDark,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            'useTheme должен использоваться внутри ThemeProvider'
        );
    }

    return context;
}
