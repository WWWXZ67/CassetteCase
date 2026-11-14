
import React from 'react';

import ButtonBase from '../1/ButtonBase';
import { Colors } from '../../../theme';

export default function ButtonSpeed({ onPress }) {

    return (

        <ButtonBase
            title="Скорость воспроизведения"
            onPress={onPress}

            width={220}
            height={45}

            backgroundColor={Colors.surfaceLight}
            textColor={Colors.gradientGreen}

            fontSize={14}
            fontWeight="600"

            borderRadius={12}
            borderWidth={1}
            borderColor={Colors.gradientPurple}
        />

    );
}
