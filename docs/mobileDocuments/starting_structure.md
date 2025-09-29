# Focus Suite - Component Architecture

This document outlines the complete component architecture for the Focus Suite productivity application.

## Project Structure

```
components/
├── shared/                    # Reusable components across all modules
│   ├── navigation/           # Navigation-related components
│   │   ├── NavigationHeader.tsx
│   │   ├── BackButton.tsx
│   │   ├── FocusTabBar.tsx
│   │   └── FocusTabBarItem.tsx
│   ├── buttons/              # Button components
│   │   ├── PrimaryButton.tsx
│   │   ├── SecondaryButton.tsx
│   │   ├── IconButton.tsx
│   │   └── LongPressButton.tsx
│   ├── forms/                # Form input components
│   │   ├── TextField.tsx
│   │   ├── Picker.tsx
│   │   ├── Switch.tsx
│   │   └── Slider.tsx
│   ├── feedback/             # User feedback components
│   │   ├── Toast.tsx
│   │   ├── Alert.tsx
│   │   ├── HapticFeedback.tsx
│   │   └── LoadingSpinner.tsx
│   └── layout/               # Layout and container components
│       ├── Card.tsx
│       ├── Container.tsx
│       └── SafeAreaWrapper.tsx
│
├── modules/                   # Module-specific components
│   ├── timer/                # Pomodoro Timer components
│   │   ├── TimerDisplay.tsx
│   │   ├── ProgressRing.tsx
│   │   ├── TimerControls.tsx
│   │   ├── TimerPresets.tsx       # TODO
│   │   └── SessionTypeSelector.tsx # TODO
│   ├── habits/               # Habit Tracker components
│   │   ├── HabitCard.tsx
│   │   ├── StreakIndicator.tsx
│   │   ├── HabitList.tsx          # TODO
│   │   ├── HabitCheckIn.tsx       # TODO
│   │   └── HabitCalendarView.tsx  # TODO
│   ├── soundscapes/          # Soundscapes components (TODO)
│   │   ├── FrequencyPicker.tsx
│   │   ├── SoundMixer.tsx
│   │   ├── VolumeSlider.tsx
│   │   ├── PresetCard.tsx
│   │   └── SoundToggle.tsx
│   ├── todo/                 # Todo List components (TODO)
│   │   ├── TaskItem.tsx
│   │   ├── ProjectParent.tsx
│   │   ├── PriorityBadge.tsx
│   │   ├── ResourceLink.tsx
│   │   └── TaskBlockAssignment.tsx
│   └── blocker/              # App Blocker components (Desktop only) (TODO)
│       ├── BlockRuleItem.tsx
│       ├── SchedulePicker.tsx
│       ├── AppSelector.tsx
│       ├── WebsiteInput.tsx
│       └── ActiveBlockIndicator.tsx
│
└── ui/                       # Existing UI components
    ├── icon-symbol.tsx
    └── collapsible.tsx
```

## Screen Architecture

```
app/
├── (tabs)/                   # Main tab navigation
│   ├── _layout.tsx          # Enhanced with all 5 modules
│   ├── timer.tsx            # Pomodoro Timer screen
│   ├── habits.tsx           # Habit Tracker screen
│   ├── soundscapes.tsx      # Soundscapes screen
│   ├── todo.tsx             # Todo List screen
│   ├── blocker.tsx          # App Blocker screen (Desktop only)
│   └── settings.tsx         # Settings screen
│
├── onboarding/              # Onboarding flow (TODO)
│   ├── welcome.tsx
│   ├── feature-intro.tsx
│   ├── permissions.tsx
│   └── initial-setup.tsx
│
├── timer/                   # Timer-specific screens (TODO)
│   ├── settings.tsx
│   └── stats.tsx
│
├── habits/                  # Habits-specific screens (TODO)
│   ├── detail.tsx
│   ├── create-edit.tsx
│   └── calendar.tsx
│
├── soundscapes/             # Soundscapes-specific screens (TODO)
│   ├── mixer.tsx
│   ├── presets.tsx
│   └── save-preset-modal.tsx
│
├── todo/                    # Todo-specific screens (TODO)
│   ├── project-detail.tsx
│   ├── task-detail.tsx
│   └── planner.tsx
│
├── blocker/                 # Blocker-specific screens (TODO)
│   ├── rules-list.tsx
│   ├── add-rule.tsx
│   └── schedule.tsx
│
└── settings/                # Settings-specific screens (TODO)
    ├── notifications.tsx
    ├── theme.tsx
    └── account.tsx
```

## TypeScript Architecture

```
types/
├── index.ts                 # Main exports
├── components.ts            # Component prop interfaces
└── navigation.ts            # Navigation type definitions
```

### Key Types

- **BaseComponentProps**: Foundation for all custom components
- **Navigation Types**: Type-safe routing for all screen stacks
- **Module Data Types**: Timer sessions, habits, tasks, etc.
- **Theme Types**: Light/dark mode support

## Key Features Implemented

### ✅ Completed Components

1. **Shared Components**
   - Navigation (Header, Back Button, Custom Tab Bar)
   - Buttons (Primary, Secondary, Icon, Long Press)
   - Forms (TextField, Picker, Switch, Slider)
   - Feedback (Toast, Alert, Haptic, Loading)
   - Layout (Card, Container, Safe Area)

2. **Module Components**
   - Timer (Display, Progress Ring, Controls)
   - Habits (Card, Streak Indicator)

3. **Architecture**
   - TypeScript interfaces and types
   - Navigation structure with 5 modules
   - Screen placeholders for all modules
   - Component export structure

### 🔄 TODO Components

1. **Typography Components**
   - Heading, Body, Caption variants

2. **Empty State Components**
   - EmptyStateView, SkeletonLoader

3. **Remaining Module Components**
   - Complete Soundscapes module
   - Complete Todo module
   - Complete App Blocker module (Desktop)

4. **Additional Screens**
   - Onboarding flow
   - Module-specific detail screens
   - Settings screens

## Usage Examples

### Using Shared Components

```tsx
import { PrimaryButton, Card, TextField } from '@/components/shared';

// Button with haptic feedback
<PrimaryButton
  title="Start Timer"
  onPress={handleStart}
  icon={<Icon name="play" />}
/>

// Form with validation
<TextField
  label="Habit Name"
  value={name}
  onChangeText={setName}
  required
  error={error}
/>
```

### Using Module Components

```tsx
import { TimerDisplay, HabitCard } from '@/components/modules';

// Timer with progress ring
<TimerDisplay
  remainingTime={1500}
  isRunning={true}
  session={currentSession}
/>

// Habit with streak tracking
<HabitCard
  habit={habit}
  onComplete={handleComplete}
  onLongPress={handleEdit}
/>
```

## Design Principles

1. **Reusability**: Shared components work across all modules
2. **Type Safety**: Full TypeScript coverage with proper interfaces
3. **Theming**: Light/dark mode support throughout
4. **Accessibility**: ARIA labels and haptic feedback
5. **Performance**: Optimized with memo and useCallback where needed
6. **Platform Specific**: iOS/Android/Desktop variants where appropriate

## Development Guidelines

1. **Component Structure**: Each component should be self-contained with its own props interface
2. **Styling**: Use StyleSheet.create with theme-aware colors
3. **Haptic Feedback**: Include appropriate haptic responses for user interactions
4. **Error Handling**: Graceful degradation and user-friendly error states
5. **Documentation**: TODO comments for implementation guidance

This architecture provides a solid foundation for the Focus Suite application, with clear separation of concerns and scalable patterns for future development.