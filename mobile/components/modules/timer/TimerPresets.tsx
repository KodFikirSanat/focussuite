import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Card } from '@/components/shared/layout';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface TimerPresetOption {
  id: string;
  title: string;
  description: string;
  focusMinutes: number;
  breakMinutes: number;
  badge?: string;
}

interface TimerPresetsProps {
  presets: TimerPresetOption[];
  selectedPresetId: string;
  onSelect: (preset: TimerPresetOption) => void;
  style?: StyleProp<ViewStyle>;
}

const formatDuration = (minutes: number) => `${minutes} dk`;

export const TimerPresets: React.FC<TimerPresetsProps> = ({
  presets,
  selectedPresetId,
  onSelect,
  style,
}) => {
  const tintColor = useThemeColor({}, 'tint');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const separatorColor = useThemeColor({}, 'outlineVariant');

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>Odak modu seç</ThemedText>
        <ThemedText style={styles.subtitle}>
          Hazır şablonlardan birini seç veya özel sürelerini belirle.
        </ThemedText>
      </View>
      <View style={styles.list}>
        {presets.map((item) => {
          const isSelected = item.id === selectedPresetId;
          return (
            <Card
              key={item.id}
              pressable
              padding={14}
              onPress={() => onSelect(item)}
              style={[
                styles.card,
                { backgroundColor: surfaceColor },
                isSelected && {
                  borderColor: tintColor,
                  borderWidth: 2,
                  shadowOpacity: 0.12,
                },
              ]}
            >
              <View style={styles.cardContent}>
                <View style={styles.infoSection}>
                  <View style={styles.titleRow}>
                    <ThemedText type="subtitle" style={styles.cardTitle}>
                      {item.title}
                    </ThemedText>
                    {item.badge && (
                      <View style={[styles.badge, { backgroundColor: tintColor }]}>
                        <ThemedText style={styles.badgeText}>{item.badge}</ThemedText>
                      </View>
                    )}
                  </View>
                  <ThemedText
                    numberOfLines={2}
                    style={[styles.cardDescription, { color: textColor }]}
                  >
                    {item.description}
                  </ThemedText>
                </View>

                <View style={styles.durations}>
                  <ThemedText style={styles.durationValue}>
                    Odak {formatDuration(item.focusMinutes)}
                  </ThemedText>
                  <View
                    style={[styles.durationSeparator, { backgroundColor: separatorColor }]}
                  />
                  <ThemedText style={styles.durationValue}>
                    Mola {formatDuration(item.breakMinutes)}
                  </ThemedText>
                </View>
              </View>

              {isSelected && (
                <ThemedText style={[styles.selectedHint, { color: tintColor }]}>
                  Seçili
                </ThemedText>
              )}
            </Card>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  header: {
    marginBottom: 8,
    gap: 2,
  },
  title: {
    marginBottom: 0,
  },
  subtitle: {
    opacity: 0.7,
    fontSize: 12,
  },
  list: {
    width: '100%',
    gap: 8,
  },
  card: {
    width: '100%',
    gap: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  infoSection: {
    flex: 1,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    marginBottom: 0,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 12,
    opacity: 0.7,
    lineHeight: 16,
  },
  durations: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  durationSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  durationValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  selectedHint: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
});
