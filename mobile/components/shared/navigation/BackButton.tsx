import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface BackButtonProps {
  onPress?: () => void;
  color?: string;
  size?: number;
  disabled?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  color,
  size = 24,
  disabled = false,
}) => {
  const router = useRouter();
  const iconColor = useThemeColor({}, 'text');

  const handlePress = () => {
    if (disabled) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <IconSymbol
        name="chevron.left" // TODO: Add this to icon mapping
        size={size}
        color={color || iconColor}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  disabled: {
    opacity: 0.3,
  },
});