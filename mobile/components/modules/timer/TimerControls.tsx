import { IconButton, PrimaryButton, SecondaryButton } from '@/components/shared/buttons';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

interface TimerControlsProps {
  isRunning: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  onReset: () => void;
  onSkip?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  onPlayPause,
  onStop,
  onReset,
  onSkip,
  disabled = false,
  style,
}) => {
  const iconColor = useThemeColor({}, 'icon');

  return (
    <View style={[styles.container, style]}>
      <View style={styles.secondaryControls}>
        <IconButton
          icon={<IconSymbol name="arrow.clockwise" size={24} color={iconColor} />}
          onPress={onReset}
          accessibilityLabel="Zamanlayıcıyı sıfırla"
          disabled={disabled}
        />

        {onSkip && (
          <IconButton
            icon={<IconSymbol name="forward.end" size={24} color={iconColor} />}
            onPress={onSkip}
            accessibilityLabel="Bir sonraki aşamaya geç"
            disabled={disabled}
          />
        )}
      </View>

      <View style={styles.primaryControls}>
        <SecondaryButton
          title="Durdur"
          onPress={onStop}
          disabled={disabled}
          style={styles.stopButton}
        />

        <PrimaryButton
          title={isRunning ? 'Duraklat' : 'Başlat'}
          onPress={onPlayPause}
          variant={isRunning ? 'warning' : 'primary'}
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
    width: '100%',
    gap: 16,
  },
  secondaryControls: {
    flexDirection: 'row',
    gap: 16,
  },
  primaryControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  stopButton: {
    minWidth: 80,
  },
  playButton: {
    minWidth: 120,
  },
});