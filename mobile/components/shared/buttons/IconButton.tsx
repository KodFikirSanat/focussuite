import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton as PaperIconButton } from 'react-native-paper';

import { useThemeColor } from '@/hooks/use-theme-color';
import { BaseButtonProps, SizeVariant } from '@/types';

interface IconButtonProps extends BaseButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  circular?: boolean;
  backgroundColor?: string;
}

const ICON_SIZES: Record<SizeVariant, number> = {
  small: 18,
  medium: 24,
  large: 28,
};

const CONTAINER_SIZES: Record<SizeVariant, number> = {
  small: 36,
  medium: 44,
  large: 56,
};

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
  const defaultBackgroundColor = useThemeColor({}, 'surface');
  const tintColor = useThemeColor({}, 'tint');

  const handlePress = () => {
    if (disabled) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const renderIcon = React.useCallback(
    (iconProps: { size: number; color: string }) => (
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
    ),
    [icon]
  );

  return (
    <PaperIconButton
      icon={renderIcon}
      onPress={handlePress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      size={ICON_SIZES[size]}
      containerColor={backgroundColor || defaultBackgroundColor}
      rippleColor={tintColor}
      style={[
        styles.button,
        styles[`size_${size}`],
        circular ? styles.circular : styles.rounded,
        style,
      ]}
      {...(rest as Partial<React.ComponentProps<typeof PaperIconButton>>)}
    />
  );
};

const styles = StyleSheet.create({
  button: {
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
    width: CONTAINER_SIZES.small,
    height: CONTAINER_SIZES.small,
  },
  size_medium: {
    width: CONTAINER_SIZES.medium,
    height: CONTAINER_SIZES.medium,
  },
  size_large: {
    width: CONTAINER_SIZES.large,
    height: CONTAINER_SIZES.large,
  },
});