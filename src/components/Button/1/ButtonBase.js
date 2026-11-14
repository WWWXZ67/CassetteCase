
import React from 'react';

import {
    Pressable,
    Text,
    Image,
    StyleSheet,
} from 'react-native';

import { useTheme } from '../../../theme';

export default function ButtonBase({

    title,
    onPress,

    // Изображение
    image,

    // Размер
    width,
    height,

    // Цвет
    backgroundColor,
    textColor,
    
    // Шрифт
    fontSize,
    fontFamily,
    fontWeight,

    // Форма
    borderRadius,
    borderWidth,
    borderColor,

    // Дополнительно
    disabled = false,

}) {

    const { theme } = useTheme();

    return (

        <Pressable

            onPress={onPress}
            disabled={disabled}

            style={({ pressed }) => [

                styles.button,

                {
                    width,
                    height,

                    backgroundColor: backgroundColor ?? 'transparent',

                    borderRadius,
                    borderWidth,

                    borderColor: borderColor || (
                        borderWidth ? theme.silver : undefined
                    ),

                    opacity: disabled ? 0.5 : pressed ? 0.8 : 1,

                    transform: [
                        {
                            scale: pressed && !disabled ? 0.98 : 1,
                        },
                    ],
                },

            ]}

        >

            {image && (

                <Image
                    source={image}
                    style={styles.image}
                    resizeMode="contain"
                />

            )}

            {title && (

                <Text

                    style={{
                        color: textColor ?? theme.text,
                        fontSize,
                        fontFamily,
                        fontWeight,
                    }}

                >

                    {title}

                </Text>

            )}

        </Pressable>

    );

}


const styles = StyleSheet.create({

    button: {

        justifyContent: 'center',
        alignItems: 'center',

        flexDirection: 'row',

    },

    image: {

        width: 24,
        height: 24,

    },

});
