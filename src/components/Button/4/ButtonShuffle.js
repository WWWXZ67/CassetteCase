
import React from 'react';

import ButtonBase from '../1/ButtonBase';
import { Colors } from '../../../theme';

export default function ButtonShuffle({

    onPress,
    active = false

}) {

    return (

        <ButtonBase
            title={
                active
                    ? "Случайное воспроизведение включено"
                    : "Случайное воспроизведение"
            }

            onPress={onPress}

            width={260}
            height={45}

            backgroundColor={
                active ? Colors.surfaceLight : 'transparent'
            }

            textColor={
                active ? Colors.gradientGreen : Colors.text
            }

            fontSize={14}
            fontWeight="600"

            borderRadius={12}
            borderWidth={1}
            borderColor={
                active ? Colors.gradientPurple : Colors.silver
            }
        />

    );
}
