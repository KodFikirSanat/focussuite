import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: 'Timer',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="timer" color={color} />,
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="checkmark.circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="soundscapes"
        options={{
          title: 'Sounds',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="waveform" color={color} />,
        }}
      />
      {Platform.OS !== 'ios' && Platform.OS !== 'android' && (
        <Tabs.Screen
          name="blocker"
          options={{
            title: 'Blocker',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="shield" color={color} />,
          }}
        />
      )}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}
