import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Slider } from '@/components/shared/forms';
import { Card } from '@/components/shared/layout';
import { ThemedText } from '@/components/themed-text';

interface TimerDurationControlsProps {
  focusMinutes: number;
  breakMinutes: number;
  onChangeFocus: (minutes: number) => void;
  onChangeBreak: (minutes: number) => void;
  style?: StyleProp<ViewStyle>;
}

const formatMinutes = (value: number) => `${value} dk`;

export const TimerDurationControls: React.FC<TimerDurationControlsProps> = ({
  focusMinutes,
  breakMinutes,
  onChangeFocus,
  onChangeBreak,
  style,
}) => {
  return (
    <Card style={[styles.card, style]}>
      <ThemedText type="subtitle" style={styles.title}>
        Özel süreler
      </ThemedText>
      <ThemedText style={styles.description}>
        Çalışma ve mola sürelerini ihtiyacına göre ayarla. Değerler dakikadır.
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
