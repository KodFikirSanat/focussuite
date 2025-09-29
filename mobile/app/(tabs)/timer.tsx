import * as Haptics from 'expo-haptics';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  TimerControls,
  TimerDisplay,
  TimerDurationControls,
  TimerPresetOption,
  TimerPresets,
} from '@/components/modules/timer';
import { Toast, type ToastType } from '@/components/shared/feedback';
import { SafeAreaWrapper } from '@/components/shared/layout';
import { ThemedText } from '@/components/themed-text';
import { TimerSession } from '@/types';

type SessionType = TimerSession['type'];

interface DurationState {
  focusMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  cyclesBeforeLongBreak: number;
}

const CUSTOM_PRESET_ID = 'custom';

const PRESET_OPTIONS: TimerPresetOption[] = [
  {
    id: 'pomodoro',
    title: 'Pomodoro',
    description: '25 dk odak, 5 dk mola. 4 döngü sonrası uzun mola.',
    focusMinutes: 25,
    breakMinutes: 5,
    longBreakMinutes: 15,
    cyclesBeforeLongBreak: 4,
    badge: 'Klasik',
  },
  {
    id: 'deep-focus',
    title: 'Derin Odak',
    description: '90 dk odaklı çalışma, ardından 20 dk dinlenme.',
    focusMinutes: 90,
    breakMinutes: 15,
    longBreakMinutes: 20,
    cyclesBeforeLongBreak: 1,
    badge: 'Yoğun',
  },
  {
    id: CUSTOM_PRESET_ID,
    title: 'Özel',
    description: 'Süreleri kendin belirle ve kaydet.',
    focusMinutes: 50,
    breakMinutes: 10,
    longBreakMinutes: 20,
    cyclesBeforeLongBreak: 4,
  },
];

const DEFAULT_PRESET_ID = PRESET_OPTIONS[0].id;
const CUSTOM_PRESET_DEFAULTS = PRESET_OPTIONS.find((preset) => preset.id === CUSTOM_PRESET_ID)!;
const DEFAULT_PRESET = PRESET_OPTIONS.find((preset) => preset.id === DEFAULT_PRESET_ID)!;

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

export default function TimerScreen() {
  const [selectedPresetId, setSelectedPresetId] = React.useState<string>(DEFAULT_PRESET_ID);
  const [customDurations, setCustomDurations] = React.useState<DurationState>({
    focusMinutes: CUSTOM_PRESET_DEFAULTS.focusMinutes,
    breakMinutes: CUSTOM_PRESET_DEFAULTS.breakMinutes,
    longBreakMinutes: CUSTOM_PRESET_DEFAULTS.longBreakMinutes ?? 15,
    cyclesBeforeLongBreak: CUSTOM_PRESET_DEFAULTS.cyclesBeforeLongBreak ?? 4,
  });

  const [focusMinutes, setFocusMinutes] = React.useState<number>(DEFAULT_PRESET.focusMinutes);
  const [breakMinutes, setBreakMinutes] = React.useState<number>(DEFAULT_PRESET.breakMinutes);
  const [longBreakMinutes, setLongBreakMinutes] = React.useState<number>(DEFAULT_PRESET.longBreakMinutes ?? 15);
  const [cyclesBeforeLongBreak, setCyclesBeforeLongBreak] = React.useState<number>(
    DEFAULT_PRESET.cyclesBeforeLongBreak ?? 4,
  );

  const [session, setSession] = React.useState<TimerSession>({
    id: `work-${Date.now()}`,
    type: 'work',
    duration: DEFAULT_PRESET.focusMinutes * 60,
    completed: false,
  });
  const [isRunning, setIsRunning] = React.useState<boolean>(false);
  const [remainingTime, setRemainingTime] = React.useState<number>(DEFAULT_PRESET.focusMinutes * 60);
  const [completedWorkSessions, setCompletedWorkSessions] = React.useState<number>(0);

  const [toastState, setToastState] = React.useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
  });

  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const getDurationForType = React.useCallback(
    (type: SessionType) => {
      switch (type) {
        case 'work':
          return focusMinutes * 60;
        case 'break':
          return breakMinutes * 60;
        case 'longBreak':
          return longBreakMinutes * 60;
        default:
          return focusMinutes * 60;
      }
    },
    [focusMinutes, breakMinutes, longBreakMinutes],
  );

  const clearTimerInterval = React.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const showToast = React.useCallback((message: string, type: ToastType = 'info') => {
    setToastState({
      visible: true,
      message,
      type,
    });
  }, []);

  const hideToast = React.useCallback(() => {
    setToastState((prev) => ({ ...prev, visible: false }));
  }, []);

  const syncSessionDuration = React.useCallback(
    (targetType: SessionType | undefined = session?.type) => {
      if (!targetType) return;

      const updatedDuration = getDurationForType(targetType);
      setSession((prev) => (
        prev
          ? {
              ...prev,
              type: targetType,
              duration: updatedDuration,
            }
          : prev
      ));
      setRemainingTime((prev) => (isRunning ? Math.min(prev, updatedDuration) : updatedDuration));
    },
    [getDurationForType, isRunning, session?.type],
  );

  const createSession = React.useCallback(
    (type: SessionType): TimerSession => ({
      id: `${type}-${Date.now()}`,
      type,
      duration: getDurationForType(type),
      startTime: isRunning ? new Date() : undefined,
      completed: false,
    }),
    [getDurationForType, isRunning],
  );

  const startNextSession = React.useCallback(
    (type: SessionType) => {
      const next = createSession(type);
      setSession(next);
      setRemainingTime(next.duration);
    },
    [createSession],
  );

  const handleSessionCompletion = React.useCallback(
    (options: { skipped?: boolean } = {}) => {
      if (!session) return;

      const wasWorkSession = session.type === 'work';
      const updatedCompletedCount = wasWorkSession
        ? completedWorkSessions + 1
        : completedWorkSessions;

      if (wasWorkSession) {
        setCompletedWorkSessions(updatedCompletedCount);
      }

      if (!options.skipped) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      if (wasWorkSession) {
        const shouldTakeLongBreak =
          cyclesBeforeLongBreak > 0 && updatedCompletedCount % cyclesBeforeLongBreak === 0;

        if (!options.skipped) {
          showToast(
            shouldTakeLongBreak
              ? 'Odak süresi tamamlandı! Uzun mola zamanı.'
              : 'Odak süresi tamamlandı! Kısa mola zamanı.',
            'success',
          );
        }

        startNextSession(shouldTakeLongBreak ? 'longBreak' : 'break');
        return;
      }

      if (!options.skipped) {
        showToast(
          session.type === 'longBreak'
            ? 'Uzun mola sona erdi. Yeni döngüye hazırsın!'
            : 'Kısa mola sona erdi. Odaklanmaya geri dön!',
          session.type === 'longBreak' ? 'info' : 'warning',
        );
      }

      if (session.type === 'longBreak') {
        setCompletedWorkSessions(0);
      }

      startNextSession('work');
    },
    [
      session,
      completedWorkSessions,
      cyclesBeforeLongBreak,
      showToast,
      startNextSession,
    ],
  );

  React.useEffect(() => {
    if (!isRunning) {
      clearTimerInterval();
      return;
    }

    clearTimerInterval();
    intervalRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimerInterval();
    };
  }, [isRunning, session?.id, clearTimerInterval]);

  React.useEffect(() => {
    if (!isRunning || remainingTime > 0) {
      return;
    }

    handleSessionCompletion();
  }, [handleSessionCompletion, isRunning, remainingTime]);

  React.useEffect(() => {
    return () => {
      clearTimerInterval();
    };
  }, [clearTimerInterval]);

  React.useEffect(() => {
    syncSessionDuration();
  }, [focusMinutes, breakMinutes, longBreakMinutes, syncSessionDuration]);

  const applyDurationsAndReset = React.useCallback(
    (durations: DurationState) => {
      setFocusMinutes(durations.focusMinutes);
      setBreakMinutes(durations.breakMinutes);
      setLongBreakMinutes(durations.longBreakMinutes);
      setCyclesBeforeLongBreak(durations.cyclesBeforeLongBreak);

      setCompletedWorkSessions(0);
      setIsRunning(false);

      const resetSession: TimerSession = {
        id: `work-${Date.now()}`,
        type: 'work',
        duration: durations.focusMinutes * 60,
        completed: false,
      };

      setSession(resetSession);
      setRemainingTime(resetSession.duration);
    },
    [],
  );

  const handlePresetSelect = React.useCallback(
    (preset: TimerPresetOption) => {
      setSelectedPresetId(preset.id);

      const durations: DurationState =
        preset.id === CUSTOM_PRESET_ID
          ? customDurations
          : {
              focusMinutes: preset.focusMinutes,
              breakMinutes: preset.breakMinutes,
              longBreakMinutes: preset.longBreakMinutes ?? customDurations.longBreakMinutes,
              cyclesBeforeLongBreak: preset.cyclesBeforeLongBreak ?? customDurations.cyclesBeforeLongBreak,
            };

      applyDurationsAndReset(durations);
    },
    [applyDurationsAndReset, customDurations],
  );

  const handleFocusDurationChange = React.useCallback(
    (value: number) => {
      const rounded = Math.max(5, value);
      setCustomDurations((prev) => ({ ...prev, focusMinutes: rounded }));
      setFocusMinutes(rounded);
      setSelectedPresetId(CUSTOM_PRESET_ID);
      setIsRunning(false);
    },
    [],
  );

  const handleBreakDurationChange = React.useCallback(
    (value: number) => {
      const rounded = Math.max(1, value);
      setCustomDurations((prev) => ({ ...prev, breakMinutes: rounded }));
      setBreakMinutes(rounded);
      setSelectedPresetId(CUSTOM_PRESET_ID);
      setIsRunning(false);
    },
    [],
  );

  const handleLongBreakChange = React.useCallback(
    (value: number) => {
      const rounded = Math.max(5, value);
      setCustomDurations((prev) => ({ ...prev, longBreakMinutes: rounded }));
      setLongBreakMinutes(rounded);
      setSelectedPresetId(CUSTOM_PRESET_ID);
      setIsRunning(false);
    },
    [],
  );

  const handleCycleChange = React.useCallback(
    (value: number) => {
      const cycles = Math.max(1, Math.round(value));
      setCustomDurations((prev) => ({ ...prev, cyclesBeforeLongBreak: cycles }));
      setCyclesBeforeLongBreak(cycles);
      setSelectedPresetId(CUSTOM_PRESET_ID);
      setIsRunning(false);
    },
    [],
  );

  const handlePlayPause = React.useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      setSession((prev) => (prev ? { ...prev, startTime: prev.startTime ?? new Date() } : prev));
      setIsRunning(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [isRunning]);

  const handleStop = React.useCallback(() => {
    setIsRunning(false);
    setCompletedWorkSessions(0);

    const nextDuration = focusMinutes * 60;
    setSession({
      id: `work-${Date.now()}`,
      type: 'work',
      duration: nextDuration,
      completed: false,
    });
    setRemainingTime(nextDuration);
  }, [focusMinutes]);

  const handleReset = React.useCallback(() => {
    const currentType = session?.type ?? 'work';
    const resetDuration = getDurationForType(currentType);

    setIsRunning(false);
    setSession((prev) => (
      prev
        ? {
            ...prev,
            startTime: undefined,
            completed: false,
            duration: resetDuration,
          }
        : prev
    ));
    setRemainingTime(resetDuration);
  }, [getDurationForType, session?.type]);

  const handleSkip = React.useCallback(() => {
    handleSessionCompletion({ skipped: true });
  }, [handleSessionCompletion]);

  const nextSessionLabel = React.useMemo(() => {
    const currentType = session?.type ?? 'work';

    if (currentType === 'work') {
      const upcomingCompleted = completedWorkSessions + 1;
      const shouldLongBreak =
        cyclesBeforeLongBreak > 0 && upcomingCompleted % cyclesBeforeLongBreak === 0;
      return shouldLongBreak
        ? `Uzun mola • ${longBreakMinutes} dk`
        : `Kısa mola • ${breakMinutes} dk`;
    }

    return `Odak • ${focusMinutes} dk`;
  }, [
    session?.type,
    completedWorkSessions,
    cyclesBeforeLongBreak,
    focusMinutes,
    breakMinutes,
    longBreakMinutes,
  ]);

  return (
    <SafeAreaWrapper style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Zamanlayıcı
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Odak döngülerini planla, molalarını yönet ve ritmini koru.
          </ThemedText>
        </View>

        <TimerDisplay
          session={session}
          remainingTime={remainingTime}
          isRunning={isRunning}
          nextSessionLabel={nextSessionLabel}
          completedWorkSessions={completedWorkSessions}
          cyclesBeforeLongBreak={cyclesBeforeLongBreak}
          onPress={handlePlayPause}
        />

        <View style={styles.section}>
          <TimerPresets
            presets={PRESET_OPTIONS}
            selectedPresetId={selectedPresetId}
            onSelect={handlePresetSelect}
          />
        </View>

        <View style={styles.section}>
          <TimerDurationControls
            focusMinutes={focusMinutes}
            breakMinutes={breakMinutes}
            longBreakMinutes={longBreakMinutes}
            cyclesBeforeLongBreak={cyclesBeforeLongBreak}
            onChangeFocus={handleFocusDurationChange}
            onChangeBreak={handleBreakDurationChange}
            onChangeLongBreak={handleLongBreakChange}
            onChangeCycles={handleCycleChange}
          />
        </View>

        <View style={styles.section}>
          <TimerControls
            isRunning={isRunning}
            onPlayPause={handlePlayPause}
            onStop={handleStop}
            onReset={handleReset}
            onSkip={handleSkip}
          />
        </View>
      </ScrollView>

      <Toast
        visible={toastState.visible}
        message={toastState.message}
        type={toastState.type}
        onHide={hideToast}
        position="top"
      />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
    gap: 8,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 15,
  },
  section: {
    width: '100%',
  },
});