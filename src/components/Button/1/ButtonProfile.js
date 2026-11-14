import React from 'react';

import ButtonBase from './ButtonBase';
import { useTheme } from '../../../theme';

export default function ButtonProfile({ onPress }) {

    const { theme } = useTheme();

    return (
        <ButtonBase
            title="Профиль"
            onPress={onPress}

            width={110}
            height={45}

            backgroundColor="transparent"
            textColor={theme.text}

            fontSize={15}
            fontWeight="600"

            borderRadius={12}
            borderWidth={1}
            borderColor={theme.surfaceLight}
        />
    );
}