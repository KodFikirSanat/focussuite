import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import type { Settings as PaperSettings } from 'react-native-paper/lib/typescript/core/settings';
import 'react-native-reanimated';

import { useAppTheme } from '@/hooks/use-app-theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const { paperTheme, navigationTheme, colorScheme } = useAppTheme();

  const paperSettings = useMemo<Partial<PaperSettings>>(
    () => ({
      icon: (props) => <MaterialCommunityIcons {...props} />,
    }),
    []
  );

  return (
    <PaperProvider theme={paperTheme} settings={paperSettings}>
      <ThemeProvider value={navigationTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </PaperProvider>
  );
}
