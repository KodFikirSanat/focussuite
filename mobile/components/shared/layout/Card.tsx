import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { BaseCardProps } from '@/types';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

interface CardProps extends BaseCardProps {
  onPress?: () => void;
  pressable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  pressable = false,
  elevation = 2,
  radius = 12,
  padding = 16,
  style,
  ...rest
}) => {
  const backgroundColor = useThemeColor({}, 'background');

  const cardStyle = [
    styles.card,
    {
      backgroundColor,
      borderRadius: radius,
      padding,
      shadowOpacity: elevation * 0.05,
      shadowRadius: elevation * 2,
      elevation,
    },
    style,
  ];

  if (pressable || onPress) {
    return (
      <Pressable
        style={({ pressed }) => [
          ...cardStyle,
          pressed && styles.pressed,
        ]}
        onPress={onPress}
        {...rest}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <ThemedView style={cardStyle} {...rest}>
      {children}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
});