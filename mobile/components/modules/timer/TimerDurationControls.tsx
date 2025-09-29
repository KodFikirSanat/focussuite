import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Slider } from '@/components/shared/forms';
import { Card } from '@/components/shared/layout';
import { ThemedText } from '@/components/themed-text';

interface TimerDurationControlsProps {
  focusMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  cyclesBeforeLongBreak: number;
  onChangeFocus: (minutes: number) => void;
  onChangeBreak: (minutes: number) => void;
  onChangeLongBreak: (minutes: number) => void;
  onChangeCycles: (cycles: number) => void;
}

const formatMinutes = (value: number) => `${value} dk`;

export const TimerDurationControls: React.FC<TimerDurationControlsProps> = ({
  focusMinutes,
  breakMinutes,
  longBreakMinutes,
  cyclesBeforeLongBreak,
  onChangeFocus,
  onChangeBreak,
  onChangeLongBreak,
  onChangeCycles,
}) => {
  return (
    <Card style={styles.card}>
      <ThemedText type="subtitle" style={styles.title}>
        Özel süreler
      </ThemedText>
      <ThemedText style={styles.description}>
        Odak, kısa mola ve uzun mola sürelerini dilediğin gibi ayarla. Değerler dakikadır.
      </ThemedText>

      <View style={styles.sliderGroup}>
        <Slider
          label="Odak süresi"
          value={focusMinutes}
          onValueChange={(v) => onChangeFocus(Math.round(v))}
          minimumValue={10}
          maximumValue={180}
          step={5}
          formatValue={formatMinutes}
        />
        <Slider
          label="Kısa mola"
          value={breakMinutes}
          onValueChange={(v) => onChangeBreak(Math.round(v))}
          minimumValue={1}
          maximumValue={45}
          step={1}
          formatValue={formatMinutes}
        />
        <Slider
          label="Uzun mola"
          value={longBreakMinutes}
          onValueChange={(v) => onChangeLongBreak(Math.round(v))}
          minimumValue={5}
          maximumValue={60}
          step={5}
          formatValue={formatMinutes}
        />
        <Slider
          label="Uzun molaya kadar döngü"
          value={cyclesBeforeLongBreak}
          onValueChange={(v) => onChangeCycles(Math.max(1, Math.round(v)))}
          minimumValue={1}
          maximumValue={6}
          step={1}
          formatValue={(v) => `${Math.round(v)} döngü`}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 24,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    opacity: 0.7,
    marginBottom: 16,
  },
  sliderGroup: {
    gap: 12,
  },
});
