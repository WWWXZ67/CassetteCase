import React from 'react';
import { useTheme } from '../../theme';

import {
    View,
    Text,
    Image,
    Pressable,
    StyleSheet
} from 'react-native';


export default function BarEpisodeCard({

    // Информация
    title,
    podcastName,
    duration,

    // Обложка
    image,

    // Действие
    onPress,

}) {

    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (

        <Pressable

            style={styles.container}

            onPress={onPress}

        >

            {image && (

                <Image

                    source={image}

                    style={styles.image}

                />

            )}

            <View style={styles.infoContainer}>

                <Text style={styles.podcastName}>

                    {podcastName}

                </Text>

                <Text style={styles.title}>

                    {title}

                </Text>

                <Text style={styles.duration}>

                    {duration}

                </Text>

            </View>

        </Pressable>

    );

}


function createStyles(theme) {
    return StyleSheet.create({

    container: {

        flexDirection: 'row',

        alignItems: 'center',

        padding: 10,

        width: '100%',
        backgroundColor: theme.card,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: theme.cardBorder || theme.surfaceLight,

    },

    image: {

        width: 65,
        height: 65,

        borderRadius: 8,

    },

    infoContainer: {

        flex: 1,

        marginLeft: 12,

    },

    podcastName: {

        fontSize: 12,
        color: theme.textSecondary,

    },

    title: {

        fontSize: 16,
        color: theme.text,

        fontWeight: 'bold',

        marginTop: 4,

    },

    duration: {

        fontSize: 12,
        color: theme.textSecondary,

        marginTop: 4,

    },

});
}
