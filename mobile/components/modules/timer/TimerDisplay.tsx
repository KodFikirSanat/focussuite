import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { TimerSession } from '@/types';

import { ProgressRing } from './ProgressRing';

export interface TimerDisplayProps {
  session: TimerSession | null;
  remainingTime: number;
  isRunning: boolean;
  nextSessionLabel?: string;
  onPress?: () => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  session,
  remainingTime,
  isRunning,
  nextSessionLabel,
  onPress,
}) => {
  const accentColor = useThemeColor(
    {},
    session?.type === 'work'
      ? 'tint'
      : session?.type === 'break'
        ? 'success'
        : 'secondary',
  );
  const surfaceColor = useThemeColor({}, 'surface');
  const metaColor = useThemeColor({}, 'icon');

  const formatTime = React.useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const progress = React.useMemo(() => {
    if (!session || session.duration <= 0) {
      return 0;
    }

    const elapsed = session.duration - remainingTime;
    const ratio = Math.max(0, Math.min(1, elapsed / session.duration));
    return ratio * 100;
  }, [remainingTime, session]);

  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel="Pomodoro sayacı"
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.progressRingWrapper}>
        <ProgressRing
          size={240}
          progress={progress}
          color={accentColor}
          backgroundColor={surfaceColor}
        />

        <View style={styles.content} pointerEvents="none">
          <ThemedText type="title" style={styles.timeText}>
            {formatTime(remainingTime)}
          </ThemedText>

          <ThemedText style={[styles.sessionTitle, { color: accentColor }]}>
            {session ? getSessionLabel(session.type) : 'Hazır'}
          </ThemedText>

          <ThemedText style={[styles.status, { color: metaColor }]}>
            {isRunning ? 'Çalışıyor' : 'Duraklatıldı'}
          </ThemedText>


          {nextSessionLabel && (
            <ThemedText style={[styles.nextSession, { color: metaColor }]}>
              Sıradaki: {nextSessionLabel}
            </ThemedText>
          )}
        </View>
      </View>
    </Wrapper>
  );
};

const getSessionLabel = (type: TimerSession['type']) => {
  switch (type) {
    case 'work':
      return 'Odaklan';
    case 'break':
      return 'Ara';
    default:
      return 'Zamanlayıcı';
  }
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  progressRingWrapper: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 54,
    fontWeight: '700',
  },
  sessionTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
  },
  status: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '500',
  },
  nextSession: {
    marginTop: 4,
    fontSize: 13,
  },
});