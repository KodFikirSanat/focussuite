import React from 'react';
import { View, Switch as RNSwitch, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BaseComponentProps } from '@/types';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface SwitchProps extends BaseComponentProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  label,
  description,
  disabled = false,
  size = 'medium',
  style,
  ...rest
}) => {
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const handleToggle = () => {
    if (disabled) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onValueChange(!value);
  };

  const getSwitchScale = () => {
    switch (size) {
      case 'small':
        return 0.8;
      case 'large':
        return 1.2;
      default:
        return 1;
    }
  };

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={handleToggle}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          {label && (
            <ThemedText
              style={[
                styles.label,
                disabled && styles.disabledText,
              ]}
            >
              {label}
            </ThemedText>
          )}
          {description && (
            <ThemedText
              style={[
                styles.description,
                disabled && styles.disabledText,
              ]}
            >
              {description}
            </ThemedText>
          )}
        </View>

        <View
          style={[
            styles.switchContainer,
            { transform: [{ scale: getSwitchScale() }] },
          ]}
        >
          <RNSwitch
            value={value}
            onValueChange={onValueChange}
            trackColor={{
              false: 'rgba(0,0,0,0.2)',
              true: tintColor,
            }}
            thumbColor="white"
            disabled={disabled}
            {...rest}
          />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 18,
  },
  disabledText: {
    opacity: 0.5,
  },
  switchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});