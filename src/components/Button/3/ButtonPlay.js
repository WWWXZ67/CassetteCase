
import React from 'react';

import ButtonBase from '../1/ButtonBase';
import { Colors } from '../../../theme';

export default function ButtonPlay({ onPress }) {

    return (

        <ButtonBase

            title="Воспроизвести"
            onPress={onPress}

            width={150}
            height={45}

            backgroundColor={Colors.primary}
            textColor="#FFFFFF"

            fontSize={16}
            fontWeight="700"

            borderRadius={12}

        />

    );
}
