import * as Haptics from 'expo-haptics';
import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';

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
  const backgroundKey = VARIANT_BACKGROUND_COLOR[variant];
  const textKey = VARIANT_TEXT_COLOR[variant];
  const backgroundColor: string = useThemeColor({}, backgroundKey);
  const textColor: string = useThemeColor({}, textKey);

  const handlePress = () => {
    if (disabled || loading) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };
  const contentStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.content, styles[`content_${size}`]],
    [size]
  );

  const labelStyle = useMemo<StyleProp<TextStyle>>(
    () => [styles.label, styles[`label_${size}`], { color: textColor }],
    [size, textColor]
  );

  const renderIcon = icon
    ? (iconProps: { size: number; color: string }) => (
        <View style={styles.iconContainer}>
          {React.isValidElement(icon)
            ? React.cloneElement(
                icon as React.ReactElement<{ color?: string; size?: number }>,
                {
                  color: iconProps.color,
                  size: iconProps.size,
                }
              )
            : icon}
        </View>
      )
    : undefined;

  return (
    <Button
      mode="contained"
      onPress={handlePress}
      disabled={disabled || loading}
      loading={loading}
      style={[styles.button, fullWidth && styles.fullWidth, style]}
      contentStyle={contentStyle}
      labelStyle={labelStyle}
      buttonColor={backgroundColor}
      textColor={textColor}
      icon={renderIcon}
      uppercase={false}
      accessibilityState={{ disabled: disabled || loading }}
      {...(rest as Partial<React.ComponentProps<typeof Button>>)}
    >
      {title}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  content: {
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content_small: {
    minHeight: 36,
    paddingHorizontal: 16,
  },
  content_medium: {
    minHeight: 44,
    paddingHorizontal: 24,
  },
  content_large: {
    minHeight: 52,
    paddingHorizontal: 32,
  },
  label: {
    fontWeight: '600',
  },
  label_small: {
    fontSize: 14,
  },
  label_medium: {
    fontSize: 16,
  },
  label_large: {
    fontSize: 18,
  },
  iconContainer: {
    marginRight: 4,
  },
});