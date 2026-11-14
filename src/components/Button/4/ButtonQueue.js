
import React from 'react';

import ButtonBase from '../1/ButtonBase';
import { useTheme } from '../../../theme';


export default function ButtonQueue({ onPress, title = 'Очередь воспроизведения' }) {

    const { theme } = useTheme();

    return (

        <ButtonBase
            title={title}
            onPress={onPress}

            width={230}
            height={45}

            backgroundColor={theme.surfaceLight}
            textColor={theme.text}

            fontSize={15}
            fontWeight="600"

            borderRadius={12}
            borderWidth={1}
            borderColor={theme.silver}

        />

    );

}
