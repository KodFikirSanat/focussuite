import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Route } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface FocusTabBarItemProps {
  route: Route<string>;
  isFocused: boolean;
  options: BottomTabNavigationOptions;
  onPress: () => void;
  onLongPress: () => void;
}

export const FocusTabBarItem: React.FC<FocusTabBarItemProps> = ({
  route,
  isFocused,
  options,
  onPress,
  onLongPress,
}) => {
  const activeTintColor = useThemeColor({}, 'tint');
  const inactiveTintColor = useThemeColor({}, 'tabIconDefault');

  const color = isFocused ? activeTintColor : inactiveTintColor;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        {options.tabBarIcon && (
          <View style={styles.iconContainer}>
            {options.tabBarIcon({
              focused: isFocused,
              color,
              size: 24
            })}
          </View>
        )}

        {options.title && (
          <ThemedText
            style={[
              styles.label,
              { color },
              isFocused && styles.focusedLabel,
            ]}
            numberOfLines={1}
          >
            {options.title}
          </ThemedText>
        )}

        {isFocused && <View style={[styles.indicator, { backgroundColor: color }]} />}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  focusedLabel: {
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});