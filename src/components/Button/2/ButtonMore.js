
import React from 'react';

import ButtonBase from '../1/ButtonBase';
import { Colors } from '../../../theme';

export default function ButtonMore({ onPress }) {

    return (

        <ButtonBase
            title="Ещё"
            onPress={onPress}

            width={80}
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
