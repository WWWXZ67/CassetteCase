
import React from 'react';

import AppNavigator from './src/navigation/AppNavigator';

import { AuthProvider } from './src/Auth/Context/AuthContext';
import { ThemeProvider } from './src/theme';
import { QueueProvider } from './src/Podcast/Context/QueueContext';

export default function App() {

    return (
        <ThemeProvider>
            <AuthProvider>
                <QueueProvider>
                    <AppNavigator />
                </QueueProvider>
            </AuthProvider>
        </ThemeProvider>
    );

}
