import React from 'react';

import ButtonBase from '../1/ButtonBase';
import { useTheme } from '../../../theme';

export default function ButtonSearch({ onPress }) {

    const { theme } = useTheme();

    return (
        <ButtonBase
            title="Поиск"
            onPress={onPress}

            width={100}
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