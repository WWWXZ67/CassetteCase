import React from 'react';

import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native';import ButtonPlay from '../Button/3/ButtonPlay';

import ButtonPause from '../Button/3/ButtonPause';

export default function BarMiniPlayer({

    // Информация
    title,
    podcastName,
    image,

    // Состояние
    isPlaying = false,

    // Действия
    onPlay,
    onPause,
    onOpen,

}) {

    return (

        <View style={styles.container}>

            <View
                style={styles.infoContainer}
            >

                <Image
                    source={image}

                    style={styles.image}
                />

                <View style={styles.textContainer}>

                    <Text
                        style={styles.title}

                        numberOfLines={1}
                    >
                        {title}
                    </Text>

                    <Text
                        style={styles.podcastName}

                        numberOfLines={1}
                    >
                        {podcastName}
                    </Text>

                </View>

            </View>

            <View style={styles.buttonContainer}>

                {isPlaying ? (

                    <ButtonPause
                        onPress={onPause}
                    />

                ) : (
                    <ButtonPlay
                        onPress={onPlay}
                    />
                )}
            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        width: '100%',

        minHeight: 75,

        padding: 10,

        flexDirection: 'row',

        alignItems: 'center',

        justifyContent: 'space-between',

        backgroundColor: '#EEEEEE',
    },

    infoContainer: {
        flex: 1,

        flexDirection: 'row',

        alignItems: 'center',
    },

    image: {
        width: 50,
        height: 50,

        borderRadius: 6,
    },

    textContainer: {
        flex: 1,

        marginLeft: 10,
    },

    title: {
        fontSize: 14,
        color: '#000000',

        fontWeight: 'bold',
    },

    podcastName: {
        fontSize: 12,
        color: '#777777',

        marginTop: 4,
    },

    buttonContainer: {
        marginLeft: 10,
    },
});