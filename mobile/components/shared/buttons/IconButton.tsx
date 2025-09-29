import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BaseButtonProps } from '@/types';
import { useThemeColor } from '@/hooks/use-theme-color';

interface IconButtonProps extends BaseButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  circular?: boolean;
  backgroundColor?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  accessibilityLabel,
  size = 'medium',
  disabled = false,
  circular = false,
  backgroundColor,
  style,
  ...rest
}) => {
  const defaultBackgroundColor = useThemeColor({}, 'background');

  const handlePress = () => {
    if (disabled) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getButtonStyle = () => {
    const baseStyle = styles.button;
    const sizeStyle = styles[`size_${size}`];
    const shapeStyle = circular ? styles.circular : styles.rounded;

    return [
      baseStyle,
      sizeStyle,
      shapeStyle,
      { backgroundColor: backgroundColor || defaultBackgroundColor },
      disabled && styles.disabled,
      style,
    ];
  };

  return (
    <Pressable
      style={({ pressed }) => [
        ...getButtonStyle(),
        pressed && !disabled && styles.pressed,
      ]}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      {...rest}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circular: {
    borderRadius: 999,
  },
  rounded: {
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  disabled: {
    opacity: 0.5,
  },
  // Size variants
  size_small: {
    width: 32,
    height: 32,
  },
  size_medium: {
    width: 44,
    height: 44,
  },
  size_large: {
    width: 56,
    height: 56,
  },
});