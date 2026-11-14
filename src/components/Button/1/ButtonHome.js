
import React from 'react';

import ButtonBase from './ButtonBase';
import { Colors } from '../../../theme';

export default function ButtonHome({ onPress }) {

    return (

        <ButtonBase
            title="Главная"
            onPress={onPress}

            width={120}
            height={45}

            backgroundColor={Colors.primary}
            textColor="#FFFFFF"

            fontSize={16}
            fontWeight="700"

            borderRadius={12}
        />

    );
}
