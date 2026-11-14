
import React from 'react';

import ButtonBase from '../1/ButtonBase';
import { Colors } from '../../../theme';

export default function ButtonRewind({ onPress }) {

    return (

        <ButtonBase
            title="Перемотать назад"
            onPress={onPress}

            width={180}
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
