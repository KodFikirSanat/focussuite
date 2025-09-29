import React, { useRef } from 'react';
import { Pressable, StyleSheet, View, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { GestureProps, BaseComponentProps } from '@/types';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface LongPressButtonProps extends BaseComponentProps, GestureProps {
  title?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  onLongPressComplete?: () => void;
  longPressDuration?: number;
  showProgress?: boolean;
  children?: React.ReactNode;
}

export const LongPressButton: React.FC<LongPressButtonProps> = ({
  title,
  icon,
  onPress,
  onLongPress,
  onLongPressComplete,
  longPressDuration = 1000,
  longPressDelay = 500,
  showProgress = true,
  children,
  style,
  ...rest
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Scale animation
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();

    // Start long press timer
    longPressTimerRef.current = setTimeout(() => {
      handleLongPress();
    }, longPressDelay);

    if (showProgress) {
      // Progress animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: longPressDuration,
        useNativeDriver: false,
      }).start();
    }
  };

  const handlePressOut = () => {
    // Reset animations
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    // Clear timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.();
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onLongPress?.();
    onLongPressComplete?.();
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        style={[styles.container, { backgroundColor }, style]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityHint="Long press for additional action"
        {...rest}
      >
        {showProgress && (
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressWidth,
                backgroundColor: tintColor,
              },
            ]}
          />
        )}

        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          {title && (
            <ThemedText style={styles.title} numberOfLines={1}>
              {title}
            </ThemedText>
          )}
          {children}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    opacity: 0.2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconContainer: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});