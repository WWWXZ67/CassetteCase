
import React from 'react';

import ButtonBase from '../1/ButtonBase';
import { Colors } from '../../../theme';

export default function ButtonNext({ onPress }) {

    return (

        <ButtonBase

            title="Следующий"
            onPress={onPress}

            width={120}
            height={45}

            backgroundColor="transparent"
            textColor={Colors.text}

            fontSize={15}
            fontWeight="600"

            borderRadius={12}
            borderWidth={1}
            borderColor={Colors.silver}

        />
    );
}
