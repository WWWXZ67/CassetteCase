
import React from 'react';

import ButtonBase from '../1/ButtonBase';
import { Colors } from '../../../theme';

export default function ButtonRepiat({

    onPress,
    active = false

}) {

    return (

        <ButtonBase
            title={active ? "Повтор включён" : "Повтор"}

            onPress={onPress}

            width={140}
            height={45}

            backgroundColor={
                active ? Colors.surfaceLight : 'transparent'
            }

            textColor={
                active ? Colors.gradientGreen : Colors.text
            }

            fontSize={15}
            fontWeight="600"

            borderRadius={12}
            borderWidth={1}
            borderColor={
                active ? Colors.gradientPurple : Colors.silver
            }
        />

    );
}
