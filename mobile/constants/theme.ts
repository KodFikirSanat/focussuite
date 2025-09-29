/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#007AFF';
const tintColorDark = '#0A84FF';

const secondaryColorLight = '#5856D6';
const secondaryColorDark = '#5E5CE6';

const successColorLight = '#34C759';
const successColorDark = '#30D158';

const warningColorLight = '#FF9500';
const warningColorDark = '#FF9F0A';

const dangerColorLight = '#FF3B30';
const dangerColorDark = '#FF453A';

const tertiaryColorLight = '#8E8E93';
const tertiaryColorDark = '#636366';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    secondary: secondaryColorLight,
    tertiary: tertiaryColorLight,
    success: successColorLight,
    warning: warningColorLight,
    danger: dangerColorLight,
    onTint: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onTertiary: '#11181C',
    onSuccess: '#FFFFFF',
    onWarning: '#FFFFFF',
    onDanger: '#FFFFFF',
    surface: '#F2F2F7',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    secondary: secondaryColorDark,
    tertiary: tertiaryColorDark,
    success: successColorDark,
    warning: warningColorDark,
    danger: dangerColorDark,
    onTint: '#FFFFFF',
    onSecondary: '#0B0B0D',
    onTertiary: '#FFFFFF',
    onSuccess: '#0B0B0D',
    onWarning: '#0B0B0D',
    onDanger: '#0B0B0D',
    surface: '#1C1C1E',
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
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
