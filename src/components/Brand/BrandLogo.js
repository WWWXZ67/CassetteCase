
import React from 'react';
import {
    View,
    Image,
    StyleSheet
} from 'react-native';

export default function BrandLogo({
    width = 220,
    height = 220,
    style
}) {
    return (
        <View style={[styles.container, style]}>
            <Image
                source={require('../../../assets/CC_Logo.png')}
                style={{ width, height }}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
