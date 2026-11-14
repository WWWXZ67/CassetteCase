
import React from 'react';

import ButtonBase from '../1/ButtonBase';
import { Colors } from '../../../theme';

export default function ButtonFavorite({

    onPress,
    isFavorite = false,
    disabled = false

}) {

    return (

        <ButtonBase
            title={isFavorite ? "В избранном" : "Избранное"}

            onPress={onPress}
            disabled={disabled}

            width={130}
            height={45}

            backgroundColor={
                isFavorite ? Colors.primary : 'transparent'
            }

            textColor={
                isFavorite ? '#FFFFFF' : Colors.text
            }

            fontSize={15}
            fontWeight="600"

            borderRadius={12}
            borderWidth={1}
            borderColor={Colors.primary}
        />

    );
}
