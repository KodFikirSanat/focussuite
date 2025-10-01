import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import {
  TimerControls,
  TimerDisplay,
  TimerDurationControls,
  TimerPresetOption,
  TimerPresets,
} from '@/components/modules/timer';
import { SecondaryButton } from '@/components/shared/buttons';
import { Toast, type ToastType } from '@/components/shared/feedback';
import { Card, SafeAreaWrapper } from '@/components/shared/layout';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { createInitialProjects, listAllTasks } from '@/data/sample-data';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Task, TimerSession } from '@/types';

type SessionType = TimerSession['type'];

interface DurationState {
  focusMinutes: number;
  breakMinutes: number;
}

interface TaskWithProject extends Task {
  projectTitle?: string;
}

const CUSTOM_PRESET_ID = 'custom';

const PRESET_OPTIONS: TimerPresetOption[] = [
  {
    id: 'pomodoro',
    title: 'Pomodoro',
    description: '25 dk odak, 5 dk mola. Klasik pomodoro ritmi.',
    focusMinutes: 25,
    breakMinutes: 5,
    badge: 'Klasik',
  },
  {
    id: 'deep-focus',
    title: 'Derin Odak',
    description: '90 dk odaklı çalışma, ardından 20 dk dinlenme.',
    focusMinutes: 90,
    breakMinutes: 20,
    badge: 'Yoğun',
  },
  {
    id: CUSTOM_PRESET_ID,
    title: 'Özel',
    description: 'Süreleri kendin belirle ve kaydet.',
    focusMinutes: 50,
    breakMinutes: 10,
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
  });

  const [focusMinutes, setFocusMinutes] = React.useState<number>(DEFAULT_PRESET.focusMinutes);
  const [breakMinutes, setBreakMinutes] = React.useState<number>(DEFAULT_PRESET.breakMinutes);

  const projects = React.useMemo(() => createInitialProjects(), []);
  const [taskQueue] = React.useState<TaskWithProject[]>(() => listAllTasks(projects) as TaskWithProject[]);
  const [activeTaskIndex, setActiveTaskIndex] = React.useState(0);

  const [session, setSession] = React.useState<TimerSession>({
    id: `work-${Date.now()}`,
    type: 'work',
    duration: DEFAULT_PRESET.focusMinutes * 60,
    completed: false,
  });
  const [isRunning, setIsRunning] = React.useState<boolean>(false);
  const [remainingTime, setRemainingTime] = React.useState<number>(DEFAULT_PRESET.focusMinutes * 60);
  const [toastState, setToastState] = React.useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
  });

  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const activeTask = taskQueue[activeTaskIndex];
  const upcomingTasks = React.useMemo(
    () => taskQueue.slice(activeTaskIndex + 1, activeTaskIndex + 3),
    [taskQueue, activeTaskIndex],
  );

  const getDurationForType = React.useCallback(
    (type: SessionType) => {
      switch (type) {
        case 'work':
          return focusMinutes * 60;
        case 'break':
          return breakMinutes * 60;
        default:
          return focusMinutes * 60;
      }
    },
    [focusMinutes, breakMinutes],
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

      if (!options.skipped) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      if (wasWorkSession) {
        if (!options.skipped) {
          showToast('Odak süresi tamamlandı! Kısa mola zamanı.', 'success');
        }
        startNextSession('break');
        return;
      }

      if (!options.skipped) {
        showToast('Kısa mola sona erdi. Odaklanmaya geri dön!', 'warning');
      }

      startNextSession('work');
    },
    [session, showToast, startNextSession],
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
  }, [focusMinutes, breakMinutes, syncSessionDuration]);

  const applyDurationsAndReset = React.useCallback(
    (durations: DurationState) => {
      setFocusMinutes(durations.focusMinutes);
      setBreakMinutes(durations.breakMinutes);

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

  const handleAdvanceTask = React.useCallback(() => {
    setActiveTaskIndex((prev) => {
      if (taskQueue.length === 0) {
        return prev;
      }
      return (prev + 1) % taskQueue.length;
    });
  }, [taskQueue]);

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
      return `Kısa mola • ${breakMinutes} dk`;
    }

    return `Odak • ${focusMinutes} dk`;
  }, [
    session?.type,
    focusMinutes,
    breakMinutes,
  ]);

  const pagerPages = React.useMemo(
    () => [
      {
        key: 'task',
        content: (
          <ActiveTaskPanel
            task={activeTask}
            upcoming={upcomingTasks}
            onAdvance={handleAdvanceTask}
          />
        ),
      },
      {
        key: 'presets',
        content: (
          <View style={styles.pageContent}>
            <TimerPresets
              presets={PRESET_OPTIONS}
              selectedPresetId={selectedPresetId}
              onSelect={handlePresetSelect}
              style={styles.presetsSection}
            />
          </View>
        ),
      },
      {
        key: 'durations',
        content: (
          <View style={[styles.pageContent, styles.pageContentCentered]}>
            <TimerDurationControls
              focusMinutes={focusMinutes}
              breakMinutes={breakMinutes}
              onChangeFocus={handleFocusDurationChange}
              onChangeBreak={handleBreakDurationChange}
              style={styles.durationCard}
            />
          </View>
        ),
      },
      {
        key: 'controls',
        content: (
          <View style={[styles.pageContent, styles.controlsPage]}>
            <ThemedText style={styles.controlsHint}>Akış kontrolü</ThemedText>
            <TimerControls
              isRunning={isRunning}
              onPlayPause={handlePlayPause}
              onStop={handleStop}
              onReset={handleReset}
              onSkip={handleSkip}
            />
          </View>
        ),
      },
    ],
    [
      activeTask,
      upcomingTasks,
      handleAdvanceTask,
      selectedPresetId,
      handlePresetSelect,
      focusMinutes,
      breakMinutes,
      handleFocusDurationChange,
      handleBreakDurationChange,
      isRunning,
      handlePlayPause,
      handleStop,
      handleReset,
      handleSkip,
    ],
  );

  return (
    <SafeAreaWrapper style={styles.safeArea}>
      <View style={styles.wrapper}>
        <View style={styles.topSection}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Zamanlayıcı
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Odak döngülerini planla, molalarını yönet ve ritmini koru.
            </ThemedText>
          </View>

          <View style={styles.timerContainer}>
            <TimerDisplay
              session={session}
              remainingTime={remainingTime}
              isRunning={isRunning}
              nextSessionLabel={nextSessionLabel}
              onPress={handlePlayPause}
            />
            <ThemedText style={styles.timerHint}>
              {isRunning ? 'Çalışma sürüyor. Dokunarak duraklat.' : 'Hazır. Başlatmak için zamanlayıcıya dokun.'}
            </ThemedText>
          </View>
        </View>

        <VerticalPager pages={pagerPages} />
      </View>

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

interface ActiveTaskPanelProps {
  task?: TaskWithProject;
  upcoming: TaskWithProject[];
  onAdvance: () => void;
}

const ActiveTaskPanel: React.FC<ActiveTaskPanelProps> = ({ task, upcoming, onAdvance }) => {
  const tintColor = useThemeColor({}, 'tint');
  const surfaceVariant = useThemeColor({}, 'surfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');

  if (!task) {
    return (
      <View style={[styles.taskContent, styles.taskEmpty]}>
        <ThemedText type="subtitle">Görev bulunamadı</ThemedText>
        <ThemedText style={[styles.taskDescription, styles.taskEmptyText]}>
          Planner bölümünden görev atadığında burada anlık odak öğen görünecek.
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.taskContent}>
      <View style={styles.taskHeader}>
        <ThemedText style={styles.taskSectionTitle}>Anlık görev</ThemedText>
        <View
          style={[
            styles.taskBadge,
            { backgroundColor: surfaceVariant, borderColor: outlineVariant },
          ]}
        >
          <IconSymbol name="flag.fill" size={14} color={tintColor} />
          <ThemedText style={[styles.taskBadgeText, { color: tintColor }]}>Odak bloğu</ThemedText>
        </View>
      </View>

      <View style={styles.taskInfo}>
        <ThemedText type="title" style={styles.taskTitle}>
          {task.title}
        </ThemedText>
        <ThemedText style={styles.taskProject}>
          {task.projectTitle ?? 'Bağımsız görev'}
        </ThemedText>
        {task.description ? (
          <ThemedText style={styles.taskDescription}>{task.description}</ThemedText>
        ) : null}
      </View>

      {upcoming.length > 0 && (
        <View style={styles.upcomingSection}>
          <ThemedText style={styles.upcomingLabel}>Sıradaki görevler</ThemedText>
          <View style={styles.upcomingList}>
            {upcoming.map((item) => (
              <View key={item.id} style={styles.upcomingRow}>
                <View
                  style={[
                    styles.upcomingBullet,
                    { backgroundColor: tintColor },
                  ]}
                />
                <View style={styles.upcomingTexts}>
                  <ThemedText style={styles.upcomingTitle}>{item.title}</ThemedText>
                  {item.projectTitle ? (
                    <ThemedText style={styles.upcomingProject}>
                      {item.projectTitle}
                    </ThemedText>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      <SecondaryButton
        title="Sonraki göreve geç"
        onPress={onAdvance}
        size="small"
        icon={<IconSymbol name="forward.end" size={18} color={tintColor} />}
        variant="primary"
        style={styles.taskAction}
      />
    </View>
  );
};

interface PagerPage {
  key: string;
  content: React.ReactNode;
}

interface VerticalPagerProps {
  pages: PagerPage[];
}

const VerticalPager: React.FC<VerticalPagerProps> = ({ pages }) => {
  const [containerHeight, setContainerHeight] = React.useState<number | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const inactiveDotColor = useThemeColor({}, 'outlineVariant');
  const activeDotColor = useThemeColor({}, 'tint');

  const handleLayout = React.useCallback((event: LayoutChangeEvent) => {
    setContainerHeight(event.nativeEvent.layout.height);
  }, []);

  const handleMomentumScrollEnd = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!containerHeight || containerHeight === 0) return;
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / containerHeight);
      setActiveIndex(Math.max(0, Math.min(pages.length - 1, index)));
    },
    [containerHeight, pages.length],
  );

  return (
    <View style={styles.pagerContainer} onLayout={handleLayout}>
      <FlatList
        data={pages}
        keyExtractor={(item) => item.key}
        style={styles.pagerList}
        contentContainerStyle={styles.pagerContentContainer}
        renderItem={({ item }) => (
          <View
            style={[
              styles.pagerItem,
              containerHeight ? { height: containerHeight } : { flex: 1 },
            ]}
          >
            <PagerCard>{item.content}</PagerCard>
          </View>
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        bounces={false}
        snapToAlignment="start"
        scrollEnabled={pages.length > 1}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      />

      <View style={styles.pagerIndicator} pointerEvents="none">
        {pages.map((page, index) => (
          <View
            key={page.key}
            style={[
              styles.pagerDot,
              index === activeIndex && styles.pagerDotActive,
              {
                backgroundColor: index === activeIndex ? activeDotColor : inactiveDotColor,
                opacity: index === activeIndex ? 1 : 0.4,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const PagerCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Card padding={20} radius={20} elevation={3} style={styles.pagerCard}>
    {children}
  </Card>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 24,
  },
  topSection: {
    alignItems: 'center',
    gap: 24,
  },
  header: {
    alignItems: 'center',
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
  timerContainer: {
    alignItems: 'center',
    gap: 12,
  },
  timerHint: {
    fontSize: 13,
    opacity: 0.7,
  },
  pagerContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  pagerList: {
    flex: 1,
  },
  pagerContentContainer: {
    paddingRight: 16,
    flexGrow: 1,
  },
  pagerItem: {
    width: '100%',
    paddingVertical: 4,
  },
  pagerIndicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingRight: 4,
    gap: 10,
  },
  pagerDot: {
    width: 6,
    borderRadius: 3,
    height: 12,
  },
  pagerDotActive: {
    height: 20,
  },
  pagerCard: {
    flex: 1,
    gap: 16,
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  pageContent: {
    flex: 1,
    width: '100%',
    gap: 16,
  },
  pageContentCentered: {
    justifyContent: 'center',
  },
  presetsSection: {
    marginBottom: 0,
  },
  durationCard: {
    marginTop: 0,
    padding: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  controlsPage: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
  },
  controlsHint: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: 'center',
  },
  taskContent: {
    flex: 1,
    width: '100%',
    gap: 16,
    justifyContent: 'space-between',
  },
  taskEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  taskEmptyText: {
    textAlign: 'center',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    opacity: 0.85,
  },
  taskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  taskBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  taskInfo: {
    gap: 6,
  },
  taskTitle: {
    marginBottom: 0,
  },
  taskProject: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.8,
  },
  taskDescription: {
    fontSize: 13,
    opacity: 0.7,
    lineHeight: 18,
  },
  upcomingSection: {
    gap: 8,
  },
  upcomingLabel: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.75,
  },
  upcomingList: {
    gap: 8,
  },
  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  upcomingBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  upcomingTexts: {
    flex: 1,
    gap: 2,
  },
  upcomingTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  upcomingProject: {
    fontSize: 12,
    opacity: 0.6,
  },
  taskAction: {
    alignSelf: 'flex-start',
  },
});