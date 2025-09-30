import * as Haptics from 'expo-haptics';
import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';

import { Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BaseButtonProps, ThemeVariant } from '@/types';

interface SecondaryButtonProps extends BaseButtonProps {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

type OutlineColorKey = keyof typeof Colors.light;

const OUTLINE_COLOR_MAP: Record<ThemeVariant, OutlineColorKey> = {
  primary: 'tint',
  secondary: 'secondary',
  tertiary: 'tertiary',
  danger: 'danger',
  warning: 'warning',
  success: 'success',
};

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  icon,
  variant = 'secondary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  ...rest
}) => {
  const outlineKey = OUTLINE_COLOR_MAP[variant] ?? 'tint';
  const tintColor: string = useThemeColor({}, outlineKey);
  const textColor: string = useThemeColor({}, 'tint');
  const backgroundColor: string = useThemeColor({}, 'background');

  const handlePress = () => {
    if (disabled || loading) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
      mode="outlined"
      onPress={handlePress}
      disabled={disabled || loading}
      loading={loading}
      style={[
        styles.button,
        { borderColor: tintColor },
        fullWidth && styles.fullWidth,
        style,
      ]}
      contentStyle={contentStyle}
      labelStyle={labelStyle}
      textColor={textColor}
      buttonColor={backgroundColor}
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
    borderWidth: 1.5,
    backgroundColor: 'transparent',
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
    textAlign: 'center',
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
  fullWidth: {
    alignSelf: 'stretch',
  },
});