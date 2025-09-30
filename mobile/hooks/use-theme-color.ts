/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import type { MD3Theme } from 'react-native-paper';

import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

const PAPER_COLOR_MAP: Partial<Record<keyof typeof Colors.light, keyof MD3Theme['colors']>> = {
  text: 'onSurface',
  background: 'background',
  tint: 'primary',
  icon: 'onSurfaceVariant',
  tabIconDefault: 'onSurfaceVariant',
  tabIconSelected: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  onTint: 'onPrimary',
  onSecondary: 'onSecondary',
  onTertiary: 'onTertiary',
  surface: 'surface',
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { colorScheme, paperTheme } = useAppTheme();
  const colorFromProps = props[colorScheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    const mappedKey = PAPER_COLOR_MAP[colorName];
    if (mappedKey) {
      const mappedColor = paperTheme.colors[mappedKey];
      if (typeof mappedColor === 'string') {
        return mappedColor;
      }
    }

    return Colors[colorScheme][colorName];
  }
}
