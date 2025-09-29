import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Root Stack Navigator Types
export type RootStackParamList = {
  '(tabs)': undefined;
  modal: undefined;
  onboarding: undefined;
  'timer-settings': undefined;
  'habit-detail': { habitId: string };
  'habit-create-edit': { habitId?: string };
  'task-detail': { taskId: string };
  'project-detail': { projectId: string };
  'add-block-rule': undefined;
  'preset-detail': { presetId: string };
};

// Tab Navigator Types
export type TabParamList = {
  timer: undefined;
  habits: undefined;
  soundscapes: undefined;
  todo: undefined;
  blocker: undefined; // Desktop only
  settings: undefined;
};

// Timer Stack Types
export type TimerStackParamList = {
  'timer-main': undefined;
  'timer-settings': undefined;
  'timer-stats': undefined;
};

// Habits Stack Types
export type HabitsStackParamList = {
  'habits-list': undefined;
  'habit-detail': { habitId: string };
  'habit-create-edit': { habitId?: string };
  'habit-calendar': undefined;
};

// Soundscapes Stack Types
export type SoundscapesStackParamList = {
  'soundscapes-main': undefined;
  'mixer': undefined;
  'presets': undefined;
  'save-preset-modal': { presetData: any };
};

// Todo Stack Types
export type TodoStackParamList = {
  'todo-main': undefined;
  'project-detail': { projectId: string };
  'task-detail': { taskId: string };
  'planner': undefined;
};

// App Blocker Stack Types (Desktop only)
export type BlockerStackParamList = {
  'blocker-main': undefined;
  'rules-list': undefined;
  'add-rule': undefined;
  'schedule': undefined;
};

// Settings Stack Types
export type SettingsStackParamList = {
  'settings-main': undefined;
  'notification-settings': undefined;
  'theme-settings': undefined;
  'account': undefined;
};

// Onboarding Stack Types
export type OnboardingStackParamList = {
  welcome: undefined;
  'feature-intro': undefined;
  permissions: undefined;
  'initial-setup': undefined;
};

// Navigation prop types for screens
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
export type TimerNavigationProp = StackNavigationProp<TimerStackParamList>;
export type HabitsNavigationProp = StackNavigationProp<HabitsStackParamList>;
export type SoundscapesNavigationProp = StackNavigationProp<SoundscapesStackParamList>;
export type TodoNavigationProp = StackNavigationProp<TodoStackParamList>;
export type BlockerNavigationProp = StackNavigationProp<BlockerStackParamList>;
export type SettingsNavigationProp = StackNavigationProp<SettingsStackParamList>;
export type OnboardingNavigationProp = StackNavigationProp<OnboardingStackParamList>;

// Route prop types
export type HabitDetailRouteProp = RouteProp<HabitsStackParamList, 'habit-detail'>;
export type TaskDetailRouteProp = RouteProp<TodoStackParamList, 'task-detail'>;
export type ProjectDetailRouteProp = RouteProp<TodoStackParamList, 'project-detail'>;

// Common navigation props interface
export interface NavigationProps {
  navigation: any;
  route?: any;
}

// Screen component props with navigation
export interface ScreenProps<T = any> extends NavigationProps {
  route: T;
}