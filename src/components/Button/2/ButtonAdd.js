
import React from 'react';

import ButtonBase from '../1/ButtonBase';
import { Colors } from '../../../theme';

export default function ButtonAdd({ onPress }) {

    return (

        <ButtonBase
            title="Добавить"
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
