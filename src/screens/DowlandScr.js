import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
  Image,
} from 'react-native';

const COLORS = {
  background: '#101114',
  card: '#191A1F',
  border: '#292A30',
  orange: '#FF7628',
  white: '#FFFFFF',
  secondary: '#A1A1AA',
};

const loadingMessages = [
  'Достаем кассеты',
  'Проверяем ленту',
  'Меняем кассеты',
];

function CassetteLoader() {
  const outerRotation = useRef(new Animated.Value(0)).current;
  const innerRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const outerAnimation = Animated.loop(
      Animated.timing(outerRotation, {
        toValue: 1,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false,
      })
    );

    const innerAnimation = Animated.loop(
      Animated.timing(innerRotation, {
        toValue: 1,
        duration: 2600,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false,
      })
    );

    outerAnimation.start();
    innerAnimation.start();

    return () => {
      outerAnimation.stop();
      innerAnimation.stop();
      outerRotation.stopAnimation();
      innerRotation.stopAnimation();
    };
  }, [outerRotation, innerRotation]);

  const outerRotate = outerRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const innerRotate = innerRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  return (
    <View style={styles.loaderContainer}>
      <Animated.View
        style={[
          styles.outerRing,
          { transform: [{ rotate: outerRotate }] },
        ]}
      />

      <Animated.View
        style={[
          styles.innerRing,
          { transform: [{ rotate: innerRotate }] },
        ]}
      />

      <View style={styles.loaderCenter}>
        <View style={styles.loaderDot} />
      </View>
    </View>
  );
}

export default function DowlandScr() {
  const [messageIndex, setMessageIndex] = useState(0);
  const textOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((previousIndex) => (
        (previousIndex + 1) % loadingMessages.length
      ));

      Animated.sequence([
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2200);

    return () => {
      clearInterval(interval);
      textOpacity.stopAnimation();
    };
  }, [textOpacity]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/CC_Logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.loadingContainer}>
          <CassetteLoader />

          <Animated.Text
            style={[
              styles.subtitle,
              { opacity: textOpacity },
            ]}
          >
            {loadingMessages[messageIndex]}
          </Animated.Text>
        </View>

        <Text style={styles.footer}>
          CASSETTE CASE
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 42,
  },

  logo: {
    width: 264,
    height: 180,
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  loaderContainer: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  outerRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 54,
    borderWidth: 4,
    borderColor: COLORS.border,
    borderTopColor: COLORS.orange,
    borderRightColor: COLORS.orange,
  },

  innerRing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: COLORS.border,
    borderTopColor: COLORS.orange,
  },

  loaderCenter: {
    width: 18,
    height: 18,
    borderRadius: 11,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loaderDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.orange,
  },

  subtitle: {
    color: COLORS.secondary,
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.5,
    minHeight: 22,
  },

  footer: {
    position: 'absolute',
    bottom: 42,
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 3,
  },
});