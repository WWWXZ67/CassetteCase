
import React from 'react';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import Slider from '@react-native-community/slider';
import { useTheme } from '../../theme';


export default function BarVolumeSlider({
    volume = 1,
    onVolumeChange,
}) {

    const { theme } = useTheme();

    return (

        <View style={styles.container}>

            <Text
                style={[
                    styles.title,
                    { color: theme.text },
                ]}
            >
                Громкость
            </Text>

            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={onVolumeChange}
                minimumTrackTintColor={theme.primary}
                maximumTrackTintColor={theme.surfaceLight}
                thumbTintColor={theme.primary}
            />

            <Text
                style={[
                    styles.value,
                    { color: theme.textSecondary },
                ]}
            >
                {Math.round(volume * 100)}%
            </Text>

        </View>

    );

}


const styles = StyleSheet.create({

    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },

    title: {
        fontSize: 14,
    },

    slider: {
        flex: 1,
        height: 40,
    },

    value: {
        fontSize: 14,
        width: 40,
        textAlign: 'right',
    },

});
