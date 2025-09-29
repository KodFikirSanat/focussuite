import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PrimaryButton, SecondaryButton, IconButton } from '@/components/shared/buttons';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface TimerControlsProps {
  isRunning: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  onReset: () => void;
  onSkip?: () => void;
  disabled?: boolean;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  onPlayPause,
  onStop,
  onReset,
  onSkip,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.secondaryControls}>
        <IconButton
          icon={<IconSymbol name="arrow.clockwise" size={24} color="#666" />}
          onPress={onReset}
          accessibilityLabel="Reset timer"
          disabled={disabled}
        />

        {onSkip && (
          <IconButton
            icon={<IconSymbol name="forward.end" size={24} color="#666" />}
            onPress={onSkip}
            accessibilityLabel="Skip session"
            disabled={disabled}
          />
        )}
      </View>

      <View style={styles.primaryControls}>
        <SecondaryButton
          title="Stop"
          onPress={onStop}
          disabled={disabled}
          style={styles.stopButton}
        />

        <PrimaryButton
          title={isRunning ? 'Pause' : 'Start'}
          onPress={onPlayPause}
          disabled={disabled}
          icon={
            <IconSymbol
              name={isRunning ? 'pause.fill' : 'play.fill'}
              size={20}
              color="white"
            />
          }
          style={styles.playButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  secondaryControls: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 16,
  },
  primaryControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stopButton: {
    minWidth: 80,
  },
  playButton: {
    minWidth: 120,
  },
});