import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { useAppTheme } from '@/hooks/use-app-theme';

export default function TabLayout() {
  const { paperTheme } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: paperTheme.colors.primary,
        tabBarInactiveTintColor: paperTheme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: paperTheme.colors.surface,
          borderTopColor: paperTheme.colors.outlineVariant,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-variant-outline" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: 'Timer',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="timer-outline" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="check-circle-outline" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="soundscapes"
        options={{
          title: 'Sounds',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="music-note-outline" size={size ?? 24} color={color} />
          ),
        }}
      />
      {Platform.OS !== 'ios' && Platform.OS !== 'android' && (
        <Tabs.Screen
          name="blocker"
          options={{
            title: 'Blocker',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="shield-check-outline" size={size ?? 24} color={color} />
            ),
          }}
        />
      )}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cog-outline" size={size ?? 24} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
