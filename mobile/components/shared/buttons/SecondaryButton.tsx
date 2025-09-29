import React from 'react';
import { Pressable, StyleSheet, ActivityIndicator, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BaseButtonProps } from '@/types';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface SecondaryButtonProps extends BaseButtonProps {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

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
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const handlePress = () => {
    if (disabled || loading) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getButtonStyle = () => {
    const baseStyle = styles.button;
    const sizeStyle = styles[`size_${size}`];

    return [
      baseStyle,
      sizeStyle,
      { borderColor: tintColor },
      fullWidth && styles.fullWidth,
      (disabled || loading) && styles.disabled,
      style,
    ];
  };

  const getTextStyle = () => {
    const baseStyle = styles.text;
    const sizeTextStyle = styles[`text_${size}`];

    return [baseStyle, sizeTextStyle, { color: tintColor }];
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
          <ActivityIndicator size="small" color={tintColor} />
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
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
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
    fontWeight: '600',
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  pressed: {
    opacity: 0.7,
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
});