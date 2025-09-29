import * as Haptics from 'expo-haptics';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BaseButtonProps, ThemeVariant } from '@/types';

interface PrimaryButtonProps extends BaseButtonProps {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

type ThemeColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

const VARIANT_BACKGROUND_COLOR: Record<ThemeVariant, ThemeColorName> = {
  primary: 'tint',
  secondary: 'secondary',
  tertiary: 'tertiary',
  danger: 'danger',
  warning: 'warning',
  success: 'success',
};

const VARIANT_TEXT_COLOR: Record<ThemeVariant, ThemeColorName> = {
  primary: 'onTint',
  secondary: 'onSecondary',
  tertiary: 'onTertiary',
  danger: 'onDanger',
  warning: 'onWarning',
  success: 'onSuccess',
};

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  icon,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  ...rest
}) => {
  const backgroundColor = useThemeColor({}, VARIANT_BACKGROUND_COLOR[variant] ?? 'tint');
  const textColor = useThemeColor({}, VARIANT_TEXT_COLOR[variant] ?? 'onTint');

  const handlePress = () => {
    if (disabled || loading) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const getButtonStyle = () => {
    const baseStyle = styles.button;
    const sizeStyle = styles[`size_${size}`];
    return [
      baseStyle,
      sizeStyle,
      { backgroundColor },
      fullWidth && styles.fullWidth,
      (disabled || loading) && styles.disabled,
      style,
    ];
  };

  const getTextStyle = () => {
    const baseStyle = styles.text;
    const sizeTextStyle = styles[`text_${size}`];

    return [baseStyle, sizeTextStyle, { color: textColor }];
  };

  return (
    <Pressable
      style={({ pressed }) => [
        ...getButtonStyle(),
        pressed && !disabled && !loading && styles.pressed,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      {...rest}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <ThemedText style={getTextStyle()}>{title}</ThemedText>
          </>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  // Size variants
  size_small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  size_medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 44,
  },
  size_large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 52,
  },
  // Text size variants
  text_small: {
    fontSize: 14,
  },
  text_medium: {
    fontSize: 16,
  },
  text_large: {
    fontSize: 18,
  },
  // Color variants (using same style for now, TODO: implement different colors)
  variant_primary: {},
  variant_secondary: {},
  variant_tertiary: {},
  variant_danger: {},
  variant_warning: {},
  variant_success: {},
});