
import React from 'react';

import ButtonBase from '../1/ButtonBase';
import { Colors } from '../../../theme';

export default function ButtonDelete({ onPress }) {

    return (

        <ButtonBase
            title="Очистить"
            onPress={onPress}

            width={110}
            height={45}

            backgroundColor="transparent"
            textColor={Colors.error}

            fontSize={15}
            fontWeight="600"

            borderRadius={12}
            borderWidth={1}
            borderColor={Colors.error}

        />

    );
}
