import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BaseComponentProps } from '@/types';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';

interface SliderProps extends BaseComponentProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  disabled?: boolean;
  trackHeight?: number;
  thumbSize?: number;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  label,
  showValue = true,
  formatValue,
  disabled = false,
  trackHeight = 4,
  thumbSize = 24,
  style,
  lightColor,
  darkColor,
}) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateXValueRef = useRef(0);
  const startXRef = useRef(0);

  const tintColor = useThemeColor({}, 'tint');
  const trackBaseColor = useThemeColor(
    { light: lightColor ?? 'rgba(0,0,0,0.1)', dark: darkColor ?? 'rgba(255,255,255,0.2)' },
    'background'
  );

  const setTranslateX = useCallback(
    (position: number) => {
      translateXValueRef.current = position;
      translateX.setValue(position);
    },
    [translateX]
  );

  const calculateValue = useCallback(
    (position: number) => {
      if (sliderWidth <= 0) {
        return value;
      }
      const percentage = Math.max(0, Math.min(1, position / sliderWidth));
      const rawValue = minimumValue + percentage * (maximumValue - minimumValue);
      return Math.round(rawValue / step) * step;
    },
    [sliderWidth, value, minimumValue, maximumValue, step]
  );

  const calculatePosition = useCallback(
    (val: number) => {
      if (sliderWidth <= 0) {
        return 0;
      }
      const percentage = (val - minimumValue) / (maximumValue - minimumValue);
      return percentage * sliderWidth;
    },
    [sliderWidth, minimumValue, maximumValue]
  );

  const updateValue = useCallback(
    (newValue: number) => {
      if (newValue !== value) {
        onValueChange(Math.max(minimumValue, Math.min(maximumValue, newValue)));
      }
    },
    [value, onValueChange, minimumValue, maximumValue]
  );

  const hapticFeedback = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const clampPosition = useCallback(
    (position: number) => {
      if (position < 0) return 0;
      if (sliderWidth <= 0) return 0;
      if (position > sliderWidth) return sliderWidth;
      return position;
    },
    [sliderWidth]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderGrant: () => {
          if (disabled) return;
          startXRef.current = translateXValueRef.current;
          hapticFeedback();
          Animated.spring(scaleAnim, {
            toValue: 1.15,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderMove: (_, gestureState) => {
          if (disabled) return;
          const newPosition = clampPosition(startXRef.current + gestureState.dx);
          setTranslateX(newPosition);
          const newValue = calculateValue(newPosition);
          updateValue(newValue);
        },
        onPanResponderRelease: () => {
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
          const finalPosition = calculatePosition(value);
          setTranslateX(finalPosition);
        },
        onPanResponderTerminationRequest: () => true,
        onPanResponderTerminate: () => {
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
          const finalPosition = calculatePosition(value);
          setTranslateX(finalPosition);
        },
      }),
    [
      disabled,
      clampPosition,
      calculateValue,
      calculatePosition,
      hapticFeedback,
      scaleAnim,
      setTranslateX,
      updateValue,
      value,
    ]
  );

  React.useEffect(() => {
    if (sliderWidth > 0) {
      const position = calculatePosition(value);
      setTranslateX(position);
    }
  }, [calculatePosition, setTranslateX, sliderWidth, value]);

  const activeTrackStyle = {
    height: trackHeight,
    backgroundColor: disabled ? 'rgba(0,0,0,0.2)' : tintColor,
    width: translateX,
  };

  const thumbAnimatedStyle = {
    transform: [
      { translateX: Animated.subtract(translateX, thumbSize / 2) },
      { scale: scaleAnim },
    ],
    opacity: disabled ? 0.5 : 1,
  };

  const displayValue = formatValue ? formatValue(value) : value.toString();

  return (
  <View style={[styles.container, style]}>
      {(label || showValue) && (
        <View style={styles.headerContainer}>
          {label && (
            <ThemedText style={[styles.label, disabled && styles.disabledText]}>
              {label}
            </ThemedText>
          )}
          {showValue && (
            <ThemedText style={[styles.value, disabled && styles.disabledText]}>
              {displayValue}
            </ThemedText>
          )}
        </View>
      )}

      <View
        style={styles.sliderContainer}
        onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
      >
        <View
          style={[
            styles.track,
            {
              height: trackHeight,
              backgroundColor: trackBaseColor,
            },
          ]}
        />

        <Animated.View
          style={[styles.activeTrack, activeTrackStyle]}
        />

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: disabled ? 'rgba(0,0,0,0.3)' : tintColor,
            },
            thumbAnimatedStyle,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    opacity: 0.5,
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  activeTrack: {
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
  thumb: {
    position: 'absolute',
    top: '50%',
    marginTop: -12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});