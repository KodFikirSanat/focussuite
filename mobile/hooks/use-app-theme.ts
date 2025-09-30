import type { Theme as NavigationTheme } from '@react-navigation/native';
import { useMemo } from 'react';
import type { MD3Theme } from 'react-native-paper';

import { getNavigationTheme, getPaperTheme } from '@/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Scheme = 'light' | 'dark';

interface AppTheme {
  colorScheme: Scheme;
  paperTheme: MD3Theme;
  navigationTheme: NavigationTheme;
}

export function useAppTheme(): AppTheme {
  const colorScheme = useColorScheme();
  const scheme: Scheme = colorScheme === 'dark' ? 'dark' : 'light';

  return useMemo(
    () => ({
      colorScheme: scheme,
      paperTheme: getPaperTheme(scheme),
      navigationTheme: getNavigationTheme(scheme),
    }),
    [scheme]
  );
}
