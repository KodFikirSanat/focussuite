/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const MD3_COLORS = {
  light: {
    primary: '#6750A4',
    onPrimary: '#FFFFFF',
    secondary: '#625B71',
    onSecondary: '#FFFFFF',
    tertiary: '#7D5260',
    onTertiary: '#FFFFFF',
    error: '#B3261E',
    onError: '#FFFFFF',
    background: '#FEF7FF',
    onBackground: '#1C1B1F',
    surface: '#FFFBFE',
    onSurface: '#1C1B1F',
    surfaceVariant: '#E7E0EC',
    onSurfaceVariant: '#49454F',
    outline: '#7A757F',
    outlineVariant: '#CAC4D0',
  },
  dark: {
    primary: '#D0BCFF',
    onPrimary: '#381E72',
    secondary: '#CCC2DC',
    onSecondary: '#332D41',
    tertiary: '#EFB8C8',
    onTertiary: '#492532',
    error: '#F2B8B5',
    onError: '#601410',
    background: '#141218',
    onBackground: '#E6E1E5',
    surface: '#1C1B1F',
    onSurface: '#E6E1E5',
    surfaceVariant: '#49454F',
    onSurfaceVariant: '#CAC4D0',
    outline: '#938F99',
    outlineVariant: '#47464F',
  },
};

const SUPPORTING_COLORS = {
  successLight: '#3B873E',
  successDark: '#86EFAC',
  warningLight: '#E59E3B',
  warningDark: '#FACC15',
};

export const Colors = {
  light: {
    text: MD3_COLORS.light.onSurface,
    background: MD3_COLORS.light.background,
    tint: MD3_COLORS.light.primary,
    icon: MD3_COLORS.light.onSurfaceVariant,
    tabIconDefault: MD3_COLORS.light.onSurfaceVariant,
    tabIconSelected: MD3_COLORS.light.primary,
    secondary: MD3_COLORS.light.secondary,
    tertiary: MD3_COLORS.light.tertiary,
    success: SUPPORTING_COLORS.successLight,
    warning: SUPPORTING_COLORS.warningLight,
    danger: MD3_COLORS.light.error,
    onTint: MD3_COLORS.light.onPrimary,
    onSecondary: MD3_COLORS.light.onSecondary,
    onTertiary: MD3_COLORS.light.onTertiary,
    onSuccess: '#0B3D17',
    onWarning: '#1F1303',
    onDanger: MD3_COLORS.light.onError,
    surface: MD3_COLORS.light.surface,
    surfaceVariant: MD3_COLORS.light.surfaceVariant,
    onSurfaceVariant: MD3_COLORS.light.onSurfaceVariant,
    outline: MD3_COLORS.light.outline,
    outlineVariant: MD3_COLORS.light.outlineVariant,
  },
  dark: {
    text: MD3_COLORS.dark.onSurface,
    background: MD3_COLORS.dark.background,
    tint: MD3_COLORS.dark.primary,
    icon: MD3_COLORS.dark.onSurfaceVariant,
    tabIconDefault: MD3_COLORS.dark.onSurfaceVariant,
    tabIconSelected: MD3_COLORS.dark.primary,
    secondary: MD3_COLORS.dark.secondary,
    tertiary: MD3_COLORS.dark.tertiary,
    success: SUPPORTING_COLORS.successDark,
    warning: SUPPORTING_COLORS.warningDark,
    danger: MD3_COLORS.dark.error,
    onTint: MD3_COLORS.dark.onPrimary,
    onSecondary: MD3_COLORS.dark.onSecondary,
    onTertiary: MD3_COLORS.dark.onTertiary,
    onSuccess: '#052912',
    onWarning: '#231200',
    onDanger: MD3_COLORS.dark.onError,
    surface: MD3_COLORS.dark.surface,
    surfaceVariant: MD3_COLORS.dark.surfaceVariant,
    onSurfaceVariant: MD3_COLORS.dark.onSurfaceVariant,
    outline: MD3_COLORS.dark.outline,
    outlineVariant: MD3_COLORS.dark.outlineVariant,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Roboto',
    serif: 'serif',
    rounded: 'sans-serif-rounded',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
