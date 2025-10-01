import { IconButton, PrimaryButton } from '@/components/shared/buttons';
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
      <View style={styles.actionRow}>
        <IconButton
          icon={<IconSymbol name="arrow.clockwise" size={24} color={iconColor} />}
          onPress={onReset}
          accessibilityLabel="Zamanlayıcıyı sıfırla"
          disabled={disabled}
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

        {onSkip && (
          <IconButton
            icon={<IconSymbol name="forward.end" size={24} color={iconColor} />}
            onPress={onSkip}
            accessibilityLabel="Bir sonraki aşamaya geç"
            disabled={disabled}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
    width: '100%',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
  },
  playButton: {
    minWidth: 160,
  },
});