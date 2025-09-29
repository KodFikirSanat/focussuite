import * as Haptics from 'expo-haptics';

export type HapticType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection';

export class HapticFeedback {
  /**
   * Trigger haptic feedback based on type
   */
  static async trigger(type: HapticType): Promise<void> {
    try {
      switch (type) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case 'selection':
          await Haptics.selectionAsync();
          break;
      }
    } catch (error) {
      console.warn('Haptic feedback error:', error);
    }
  }

  /**
   * Light impact for subtle interactions (button press, list item selection)
   */
  static light = () => HapticFeedback.trigger('light');

  /**
   * Medium impact for standard interactions (tab switch, form submission)
   */
  static medium = () => HapticFeedback.trigger('medium');

  /**
   * Heavy impact for significant interactions (delete, complete action)
   */
  static heavy = () => HapticFeedback.trigger('heavy');

  /**
   * Success notification (task completion, save success)
   */
  static success = () => HapticFeedback.trigger('success');

  /**
   * Warning notification (validation error, caution)
   */
  static warning = () => HapticFeedback.trigger('warning');

  /**
   * Error notification (failure, critical error)
   */
  static error = () => HapticFeedback.trigger('error');

  /**
   * Selection change (picker value change, switch toggle)
   */
  static selection = () => HapticFeedback.trigger('selection');

  /**
   * Custom pattern for long press actions
   */
  static async longPress(): Promise<void> {
    await HapticFeedback.light();
    setTimeout(async () => {
      await HapticFeedback.medium();
    }, 100);
  }

  /**
   * Custom pattern for drag start
   */
  static async dragStart(): Promise<void> {
    await HapticFeedback.medium();
  }

  /**
   * Custom pattern for drag end
   */
  static async dragEnd(): Promise<void> {
    await HapticFeedback.light();
  }

  /**
   * Custom pattern for timer completion
   */
  static async timerComplete(): Promise<void> {
    await HapticFeedback.heavy();
    setTimeout(async () => {
      await HapticFeedback.heavy();
    }, 150);
    setTimeout(async () => {
      await HapticFeedback.heavy();
    }, 300);
  }

  /**
   * Custom pattern for habit streak milestone
   */
  static async streakMilestone(): Promise<void> {
    await HapticFeedback.success();
    setTimeout(async () => {
      await HapticFeedback.success();
    }, 200);
  }
}

// React hook for haptic feedback
export const useHapticFeedback = () => {
  return {
    light: HapticFeedback.light,
    medium: HapticFeedback.medium,
    heavy: HapticFeedback.heavy,
    success: HapticFeedback.success,
    warning: HapticFeedback.warning,
    error: HapticFeedback.error,
    selection: HapticFeedback.selection,
    longPress: HapticFeedback.longPress,
    dragStart: HapticFeedback.dragStart,
    dragEnd: HapticFeedback.dragEnd,
    timerComplete: HapticFeedback.timerComplete,
    streakMilestone: HapticFeedback.streakMilestone,
    trigger: HapticFeedback.trigger,
  };
};