import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  message?: string;
  overlay?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color,
  message,
  overlay = false,
}) => {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  const spinnerColor = color || tintColor;

  useEffect(() => {
    const spin = () => {
      spinAnim.setValue(0);
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => spin());
    };

    spin();
  }, [spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSpinnerSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 40;
      default:
        return 28;
    }
  };

  const spinnerSize = getSpinnerSize();

  const spinner = (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: spinnerSize,
            height: spinnerSize,
            borderColor: spinnerColor,
            transform: [{ rotate: spin }],
          },
        ]}
      />
      {message && (
        <ThemedText style={[styles.message, styles[`message_${size}`]]}>
          {message}
        </ThemedText>
      )}
    </View>
  );

  if (overlay) {
    return (
      <View style={[styles.overlay, { backgroundColor: `${backgroundColor}CC` }]}>
        {spinner}
      </View>
    );
  }

  return spinner;
};

// Alternative dot-based loader
export const DotLoader: React.FC<{
  size?: 'small' | 'medium' | 'large';
  color?: string;
}> = ({ size = 'medium', color }) => {
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  const tintColor = useThemeColor({}, 'tint');
  const dotColor = color || tintColor;

  useEffect(() => {
    const animateDots = () => {
      const animations = [dot1Anim, dot2Anim, dot3Anim].map((anim, index) => {
        return Animated.sequence([
          Animated.delay(index * 200),
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]);
      });

      Animated.loop(
        Animated.stagger(0, animations),
        { iterations: -1 }
      ).start();
    };

    animateDots();
  }, []);

  const getDotSize = () => {
    switch (size) {
      case 'small':
        return 4;
      case 'large':
        return 8;
      default:
        return 6;
    }
  };

  const dotSize = getDotSize();

  const renderDot = (anim: Animated.Value, index: number) => {
    const scale = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    });

    const opacity = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    });

    return (
      <Animated.View
        key={index}
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            backgroundColor: dotColor,
            marginHorizontal: dotSize / 2,
            transform: [{ scale }],
            opacity,
          },
        ]}
      />
    );
  };

  return (
    <View style={styles.dotContainer}>
      {[dot1Anim, dot2Anim, dot3Anim].map(renderDot)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  spinner: {
    borderWidth: 2,
    borderRadius: 999,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  message: {
    marginTop: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
  message_small: {
    fontSize: 12,
  },
  message_medium: {
    fontSize: 14,
  },
  message_large: {
    fontSize: 16,
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    borderRadius: 999,
  },
});