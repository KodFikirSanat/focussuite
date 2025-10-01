import React from 'react';
import { FlatList, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

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

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}> 
        <ThemedText type="subtitle" style={styles.title}>Odak modu seç</ThemedText>
        <ThemedText style={styles.subtitle}>
          Hazır şablonlardan birini seç veya özel sürelerini belirle.
        </ThemedText>
      </View>
      <FlatList
        data={presets}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedPresetId;
          return (
            <Card
              pressable
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
              {item.badge && (
                <View style={[styles.badge, { backgroundColor: tintColor }]}> 
                  <ThemedText style={styles.badgeText}>{item.badge}</ThemedText>
                </View>
              )}
              <ThemedText type="subtitle" style={styles.cardTitle}>
                {item.title}
              </ThemedText>
              <ThemedText style={[styles.cardDescription, { color: textColor }]}> 
                {item.description}
              </ThemedText>

              <View style={styles.metaRow}>
                <View style={styles.metaBlock}>
                  <ThemedText style={styles.metaLabel}>Odak</ThemedText>
                  <ThemedText style={styles.metaValue}>
                    {formatDuration(item.focusMinutes)}
                  </ThemedText>
                </View>
                <View style={styles.metaBlock}>
                  <ThemedText style={styles.metaLabel}>Mola</ThemedText>
                  <ThemedText style={styles.metaValue}>
                    {formatDuration(item.breakMinutes)}
                  </ThemedText>
                </View>
              </View>

              {isSelected && (
                <ThemedText style={[styles.selectedHint, { color: tintColor }]}>Seçili</ThemedText>
              )}
            </Card>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.7,
  },
  listContent: {
    paddingVertical: 8,
  },
  separator: {
    width: 12,
  },
  card: {
    width: 220,
    padding: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardTitle: {
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaBlock: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedHint: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
  },
});
