
import React from 'react';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import Slider from '@react-native-community/slider';
import { useTheme } from '../../theme';


export default function BarProgress({
    currentTime = 0,
    duration = 0,
    onSeek,
}) {

    const { theme } = useTheme();

    const formatTime = (seconds) => {

        const minutes = Math.floor(seconds / 60);

        const remainingSeconds = Math.floor(seconds % 60);

        return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;

    };


    return (

        <View style={styles.container}>

            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration > 0 ? duration : 1}
                value={Math.min(currentTime, duration)}
                onSlidingComplete={onSeek}
                minimumTrackTintColor={theme.primary}
                maximumTrackTintColor={theme.surfaceLight}
                thumbTintColor={theme.primary}
                disabled={duration <= 0}
            />

            <View style={styles.timeContainer}>

                <Text
                    style={[
                        styles.time,
                        { color: theme.textSecondary },
                    ]}
                >
                    {formatTime(currentTime)}
                </Text>

                <Text
                    style={[
                        styles.time,
                        { color: theme.textSecondary },
                    ]}
                >
                    {formatTime(duration)}
                </Text>

            </View>

        </View>

    );

}


const styles = StyleSheet.create({

    container: {
        width: '100%',
    },

    slider: {
        width: '100%',
        height: 40,
    },

    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    time: {
        fontSize: 12,
    },

});
