import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TimerSession } from '@/types';
import { ThemedText } from '@/components/themed-text';
import { ProgressRing } from './ProgressRing';

interface TimerDisplayProps {
  session?: TimerSession;
  remainingTime: number;
  isRunning: boolean;
  onPress?: () => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  session,
  remainingTime,
  isRunning,
  onPress,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionTitle = () => {
    if (!session) return 'Ready';
    switch (session.type) {
      case 'work': return 'Focus';
      case 'break': return 'Break';
      case 'longBreak': return 'Long Break';
      default: return 'Timer';
    }
  };

  const getProgress = () => {
    if (!session) return 0;
    return ((session.duration - remainingTime) / session.duration) * 100;
  };

  return (
    <View style={styles.container}>
      {/* TODO: Implement ProgressRing component */}
      <ProgressRing
        size={250}
        progress={getProgress()}
        strokeWidth={8}
        color={session?.type === 'work' ? '#FF6B6B' : '#4ECDC4'}
      />

      <View style={styles.content}>
        <ThemedText type="title" style={styles.timeText}>
          {formatTime(remainingTime)}
        </ThemedText>

        <ThemedText style={styles.sessionType}>
          {getSessionTitle()}
        </ThemedText>

        <ThemedText style={styles.status}>
          {isRunning ? 'Running' : 'Paused'}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  content: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sessionType: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
  status: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.6,
  },
});