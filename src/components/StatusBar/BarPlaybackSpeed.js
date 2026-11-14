
import React from 'react';

import {
    View,
    Text,
    Pressable,
    StyleSheet,
} from 'react-native';

import { useTheme } from '../../theme';


export default function BarPlaybackSpeed({
    speed = 1,
    onSpeedChange,
}) {

    const { theme } = useTheme();

    const speeds = [
        0.5,
        0.75,
        1,
        1.25,
        1.5,
        1.75,
        2,
    ];


    return (

        <View style={styles.container}>

            <Text
                style={[
                    styles.title,
                    { color: theme.text },
                ]}
            >
                Скорость воспроизведения
            </Text>

            <View style={styles.speedContainer}>

                {speeds.map((item) => {

                    const isActive = speed === item;

                    return (

                        <Pressable
                            key={item}
                            onPress={() => onSpeedChange?.(item)}
                            style={[
                                styles.speedButton,
                                {
                                    backgroundColor: isActive
                                        ? theme.primary
                                        : theme.surfaceLight,

                                    borderColor: isActive
                                        ? theme.primary
                                        : theme.cardBorder || theme.surfaceLight,
                                },
                            ]}
                        >

                            <Text
                                style={[
                                    styles.speedText,
                                    {
                                        color: isActive
                                            ? '#FFFFFF'
                                            : theme.text,
                                    },
                                ]}
                            >
                                {item}x
                            </Text>

                        </Pressable>

                    );

                })}

            </View>

        </View>

    );

}


const styles = StyleSheet.create({

    container: {
        width: '100%',
    },

    title: {
        fontSize: 16,
        marginBottom: 10,
    },

    speedContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    speedButton: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
    },

    speedText: {
        fontSize: 14,
        fontWeight: '600',
    },

});
