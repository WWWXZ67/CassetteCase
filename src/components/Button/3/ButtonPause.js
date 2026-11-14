
import React from 'react';

import ButtonBase from '../1/ButtonBase';
import { useTheme } from '../../../theme';


export default function ButtonPause({ onPress }) {

    const { theme } = useTheme();

    return (

        <ButtonBase
            title="Пауза"
            onPress={onPress}

            width={100}
            height={45}

            backgroundColor={theme.surfaceLight}
            textColor={theme.text}

            fontSize={16}
            fontWeight="600"

            borderRadius={12}
            borderWidth={1}
            borderColor={theme.silver}

        />

    );

}
