
import React from 'react';

import ButtonBase from './ButtonBase';
import { Colors } from '../../../theme';

export default function ButtonSettings({ onPress }) {

    return (

        <ButtonBase
            title="Настройки"
            onPress={onPress}

            width={130}
            height={45}

            backgroundColor="transparent"
            textColor={Colors.silverLight}

            fontSize={15}
            fontWeight="600"

            borderRadius={12}
            borderWidth={1}
            borderColor={Colors.silver}
        />

    );
}
