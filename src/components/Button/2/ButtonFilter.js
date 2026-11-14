
import React from 'react';

import ButtonBase from '../1/ButtonBase';
import { Colors } from '../../../theme';

export default function ButtonFilter({ onPress }) {

    return (

        <ButtonBase
            title="Фильтр"
            onPress={onPress}

            width={100}
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
