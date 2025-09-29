import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaWrapper } from '@/components/shared/layout';
import { ThemedText } from '@/components/themed-text';
import { TimerDisplay, TimerControls } from '@/components/modules/timer';

export default function TimerScreen() {
  // TODO: Implement timer state management
  const [isRunning, setIsRunning] = React.useState(false);
  const [remainingTime, setRemainingTime] = React.useState(1500); // 25 minutes

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
    // TODO: Implement timer logic
  };

  const handleStop = () => {
    setIsRunning(false);
    // TODO: Implement stop logic
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingTime(1500);
    // TODO: Implement reset logic
  };

  return (
    <SafeAreaWrapper style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Pomodoro Timer
      </ThemedText>

      <TimerDisplay
        remainingTime={remainingTime}
        isRunning={isRunning}
      />

      <TimerControls
        isRunning={isRunning}
        onPlayPause={handlePlayPause}
        onStop={handleStop}
        onReset={handleReset}
      />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 40,
    textAlign: 'center',
  },
});