import React, { useState } from 'react';
import { View, StyleSheet, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  interpolate,
  extrapolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { BaseComponentProps } from '@/types';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

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
  ...rest
}) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const translateX = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  const calculateValue = (position: number) => {
    'worklet';
    const percentage = Math.max(0, Math.min(1, position / sliderWidth));
    const rawValue = minimumValue + percentage * (maximumValue - minimumValue);
    return Math.round(rawValue / step) * step;
  };

  const calculatePosition = (val: number) => {
    'worklet';
    const percentage = (val - minimumValue) / (maximumValue - minimumValue);
    return percentage * sliderWidth;
  };

  const updateValue = (newValue: number) => {
    if (newValue !== value) {
      onValueChange(Math.max(minimumValue, Math.min(maximumValue, newValue)));
    }
  };

  const hapticFeedback = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: () => {
      isDragging.value = true;
      runOnJS(hapticFeedback)();
    },
    onActive: (event) => {
      const newPosition = Math.max(0, Math.min(sliderWidth, event.x));
      translateX.value = newPosition;
      const newValue = calculateValue(newPosition);
      runOnJS(updateValue)(newValue);
    },
    onEnd: () => {
      isDragging.value = false;
      const finalPosition = calculatePosition(value);
      translateX.value = finalPosition;
    },
  });

  React.useEffect(() => {
    if (sliderWidth > 0) {
      const position = calculatePosition(value);
      translateX.value = position;
    }
  }, [value, sliderWidth, minimumValue, maximumValue]);

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value - thumbSize / 2 }],
      opacity: disabled ? 0.5 : 1,
    };
  });

  const activeTrackStyle = useAnimatedStyle(() => {
    return {
      width: translateX.value,
    };
  });

  const thumbScaleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value - thumbSize / 2 },
        { scale: isDragging.value ? 1.2 : 1 },
      ],
    };
  });

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
              backgroundColor: 'rgba(0,0,0,0.1)',
            },
          ]}
        />

        <Animated.View
          style={[
            styles.activeTrack,
            {
              height: trackHeight,
              backgroundColor: disabled ? 'rgba(0,0,0,0.2)' : tintColor,
            },
            activeTrackStyle,
          ]}
        />

        <PanGestureHandler onGestureEvent={gestureHandler} enabled={!disabled}>
          <Animated.View
            style={[
              styles.thumb,
              {
                width: thumbSize,
                height: thumbSize,
                borderRadius: thumbSize / 2,
                backgroundColor: disabled ? 'rgba(0,0,0,0.3)' : tintColor,
              },
              thumbScaleStyle,
            ]}
          />
        </PanGestureHandler>
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