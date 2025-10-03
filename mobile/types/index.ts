// Re-export all types for clean imports
export * from './components';
export * from './navigation';

// Module-specific data types
export interface TimerSession {
  id: string;
  type: 'work' | 'break';
  duration: number;
  startTime?: Date;
  endTime?: Date;
  completed: boolean;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  streak: number;
  completedDates: Date[];
  reminderTime?: string;
  color?: string;
  icon?: string;
}

export interface SoundPreset {
  id: string;
  name: string;
  sounds: SoundSetting[];
  createdAt: Date;
  isFavorite: boolean;
}

export interface SoundSetting {
  id: string;
  frequency: number;
  volume: number;
  enabled: boolean;
  waveType: 'sine' | 'square' | 'triangle' | 'sawtooth';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
  resources?: ResourceLink[];
  timeBlock?: TimeBlock;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  color?: string;
  tasks: Task[];
  createdAt: Date;
}

export interface ResourceLink {
  id: string;
  title: string;
  url: string;
  type: 'link' | 'file' | 'note';
}

export interface TimeBlock {
  id: string;
  startTime: Date;
  endTime: Date;
  taskId: string;
}

export interface Block {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  tasks: Task[];
}

export interface BlockRule {
  id: string;
  name: string;
  type: 'website' | 'app';
  targets: string[];
  schedule: BlockSchedule;
  enabled: boolean;
  createdAt: Date;
}

export interface BlockSchedule {
  startTime: string;
  endTime: string;
  days: number[]; // 0-6, Sunday = 0
  timezone: string;
}

// App state types
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  hapticFeedback: boolean;
  notifications: NotificationSettings;
  timerSettings: TimerSettings;
}

export interface NotificationSettings {
  enabled: boolean;
  habitReminders: boolean;
  timerAlerts: boolean;
  breakReminders: boolean;
  soundVolume: number;
}

export interface TimerSettings {
  workDuration: number;
  shortBreakDuration: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
}