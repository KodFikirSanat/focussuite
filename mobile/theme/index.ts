import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
    type Theme as NavigationTheme,
} from '@react-navigation/native';
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

import { Colors } from '@/constants/theme';

type ColorScheme = 'light' | 'dark';

const { LightTheme: NavigationLightBase, DarkTheme: NavigationDarkBase } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const paperLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.light.tint,
    onPrimary: Colors.light.onTint,
    secondary: Colors.light.secondary,
    onSecondary: Colors.light.onSecondary,
    tertiary: Colors.light.tertiary,
    onTertiary: Colors.light.onTertiary,
    background: Colors.light.background,
    onBackground: Colors.light.text,
    surface: Colors.light.surface,
    onSurface: Colors.light.text,
    surfaceVariant: '#E7E0EC',
    onSurfaceVariant: '#49454F',
    outline: '#7A757F',
    outlineVariant: '#C9C5D0',
    primaryContainer: '#DDE3FF',
    onPrimaryContainer: '#001A40',
    secondaryContainer: '#DDE1FF',
    onSecondaryContainer: '#1C1A3A',
    tertiaryContainer: '#F6DDEA',
    onTertiaryContainer: '#311022',
    inverseSurface: '#2F3237',
    inverseOnSurface: '#F3F4F6',
    error: '#B3261E',
    onError: '#FFFFFF',
    errorContainer: '#F9DEDC',
    onErrorContainer: '#410E0B',
  },
};

const paperDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.dark.tint,
    onPrimary: Colors.dark.onTint,
    secondary: Colors.dark.secondary,
    onSecondary: Colors.dark.onSecondary,
    tertiary: Colors.dark.tertiary,
    onTertiary: Colors.dark.onTertiary,
    background: Colors.dark.background,
    onBackground: Colors.dark.text,
    surface: Colors.dark.surface,
    onSurface: Colors.dark.text,
    surfaceVariant: '#3F3847',
    onSurfaceVariant: '#CAC4D0',
    outline: '#938F99',
    outlineVariant: '#47464F',
    primaryContainer: '#003072',
    onPrimaryContainer: '#D6E2FF',
    secondaryContainer: '#2E2A4F',
    onSecondaryContainer: '#E1DFFF',
    tertiaryContainer: '#4D1040',
    onTertiaryContainer: '#FFD7EF',
    inverseSurface: '#E5E1E5',
    inverseOnSurface: '#1C1B1F',
    error: '#F2B8B5',
    onError: '#601410',
    errorContainer: '#8C1D18',
    onErrorContainer: '#F2B8B5',
  },
};

const navigationLightTheme: NavigationTheme = {
  ...NavigationLightBase,
  colors: {
    ...NavigationLightBase.colors,
    primary: paperLightTheme.colors.primary,
    background: paperLightTheme.colors.background,
    card: paperLightTheme.colors.surface,
    text: paperLightTheme.colors.onSurface,
    border: paperLightTheme.colors.outline,
    notification: paperLightTheme.colors.secondary,
  },
};

const navigationDarkTheme: NavigationTheme = {
  ...NavigationDarkBase,
  colors: {
    ...NavigationDarkBase.colors,
    primary: paperDarkTheme.colors.primary,
    background: paperDarkTheme.colors.background,
    card: paperDarkTheme.colors.surface,
    text: paperDarkTheme.colors.onSurface,
    border: paperDarkTheme.colors.outline,
    notification: paperDarkTheme.colors.secondary,
  },
};

export const PaperThemes: Record<ColorScheme, MD3Theme> = Object.freeze({
  light: paperLightTheme,
  dark: paperDarkTheme,
});

export const NavigationThemes: Record<ColorScheme, NavigationTheme> = Object.freeze({
  light: navigationLightTheme,
  dark: navigationDarkTheme,
});

export function getPaperTheme(colorScheme: ColorScheme): MD3Theme {
  return PaperThemes[colorScheme];
}

export function getNavigationTheme(colorScheme: ColorScheme): NavigationTheme {
  return NavigationThemes[colorScheme];
}