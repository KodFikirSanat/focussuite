import { ReactNode } from 'react';
import { ViewStyle, TextStyle, PressableProps, ViewProps } from 'react-native';

// Base component props that extend themed functionality
export interface BaseComponentProps {
  lightColor?: string;
  darkColor?: string;
  style?: ViewStyle | TextStyle;
  children?: ReactNode;
}

// Theme variant types
export type ThemeVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'warning' | 'success';

// Size variants
export type SizeVariant = 'small' | 'medium' | 'large';

// Button base props
export interface BaseButtonProps extends PressableProps, BaseComponentProps {
  variant?: ThemeVariant;
  size?: SizeVariant;
  disabled?: boolean;
  loading?: boolean;
}

// Text input base props
export interface BaseInputProps extends BaseComponentProps {
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

// Card component props
export interface BaseCardProps extends ViewProps, BaseComponentProps {
  elevation?: number;
  radius?: number;
  padding?: number;
}

// Modal/Sheet props
export interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

// Navigation props
export interface NavigationHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightAction?: ReactNode;
  onBackPress?: () => void;
}

// Common gesture props
export interface GestureProps {
  onLongPress?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  longPressDelay?: number;
}

// Platform-specific component props
export interface PlatformComponentProps {
  ios?: ViewStyle | TextStyle;
  android?: ViewStyle | TextStyle;
  web?: ViewStyle | TextStyle;
}

// Focus Suite specific types
export type FocusModule = 'timer' | 'habits' | 'soundscapes' | 'todo' | 'blocker';

export interface ModuleComponentProps extends BaseComponentProps {
  module?: FocusModule;
}