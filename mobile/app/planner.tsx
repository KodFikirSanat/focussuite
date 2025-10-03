import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { CreateBlockModal, type CreateBlockPayload } from '@/components/modules/planner';
import { IconButton } from '@/components/shared/buttons';
import { Container, SafeAreaWrapper } from '@/components/shared/layout';
import { NavigationHeader } from '@/components/shared/navigation';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { createInitialProjects, listAllTasks } from '@/data/sample-data';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Block, Task } from '@/types';

const HOURS = Array.from({ length: 24 }, (_, index) => index);
const SLOT_HEIGHT = 64;
const MIN_BLOCK_HEIGHT = 56;
const MINUTES_IN_HOUR = 60;
const minuteToHeight = SLOT_HEIGHT / MINUTES_IN_HOUR;

const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

type PlannerTask = Task & { projectTitle?: string };

const formatHour = (hour: number) => `${hour.toString().padStart(2, '0')}:00`;
const getMinutesForDate = (date: Date) => date.getHours() * 60 + date.getMinutes();
const buildDateForTime = (baseDate: Date, time: string) => {
  const [hour, minute] = time.split(':').map(Number);
  const date = new Date(baseDate);
  date.setHours(hour, minute, 0, 0);
  return date;
};
const formatRange = (start: Date, end: Date) => {
  const format = (value: Date) =>
    `${value.getHours().toString().padStart(2, '0')}:${value
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  return `${format(start)} - ${format(end)}`;
};

export default function PlannerScreen() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const tomorrow = React.useMemo(() => {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);
    return nextDay;
  }, []);

  const availableTasks = React.useMemo<PlannerTask[]>(
    () => listAllTasks(createInitialProjects()),
    [],
  );

  const [blocks, setBlocks] = React.useState<Block[]>([]);

  // TODO: Gelecekte, 'Yemek Bloğu', 'Uyku Bloğu' gibi hazır blok şablonları eklenecek.
  // TODO: Sağlık uygulamaları entegrasyonu için verilerin (kalori, uyku süresi vb.) bu bloklara eklenmesi düşünülebilir.

  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const timelineBackground = useThemeColor({}, 'surface');
  const blockBackground = useThemeColor({}, 'tint');
  const blockTextColor = useThemeColor({}, 'onTint');
  const shadowColor = useThemeColor({}, 'outlineVariant');

  const handleCreateBlock = React.useCallback(
    (payload: CreateBlockPayload) => {
      const startTime = buildDateForTime(tomorrow, payload.startTime);
      const endTime = buildDateForTime(tomorrow, payload.endTime);
      const selectedTasks = availableTasks.filter((task) => payload.taskIds.includes(task.id));

      const newBlock: Block = {
        id: createId('planner-block'),
        title: payload.title,
        startTime,
        endTime,
        tasks: selectedTasks,
      };

      setBlocks((prev) =>
        [...prev, newBlock].sort(
          (a, b) => a.startTime.getTime() - b.startTime.getTime(),
        ),
      );
      setIsModalVisible(false);
    },
    [availableTasks, tomorrow],
  );

  return (
    <SafeAreaWrapper>
      <NavigationHeader
        title="Yarını Planla"
        showBackButton
        onBackPress={() => router.back()}
      />
      <Container flex={1} padding={0}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[styles.timelineWrapper, { borderColor: outlineVariant, backgroundColor: timelineBackground }]}
          >
            <View style={styles.hourColumn}>
              {HOURS.map((hour) => (
                <View key={hour} style={[styles.hourRow, { height: SLOT_HEIGHT }]}> 
                  <ThemedText style={styles.hourLabel}>{formatHour(hour)}</ThemedText>
                </View>
              ))}
            </View>

            <View style={[styles.timelineColumn, { borderColor: outlineVariant }]}> 
              {HOURS.map((hour) => (
                <View
                  key={`slot-${hour}`}
                  style={[styles.timelineSlot, { height: SLOT_HEIGHT, borderBottomColor: outlineVariant }]}
                />
              ))}

              {blocks.map((block) => {
                const top = getMinutesForDate(block.startTime) * minuteToHeight;
                const durationMinutes = Math.max(
                  getMinutesForDate(block.endTime) - getMinutesForDate(block.startTime),
                  15,
                );
                const height = Math.max(durationMinutes * minuteToHeight, MIN_BLOCK_HEIGHT);

                return (
                  <View
                    key={block.id}
                    style={[
                      styles.blockCard,
                      {
                        top,
                        height,
                        backgroundColor: blockBackground,
                        shadowColor,
                      },
                    ]}
                  >
                    <ThemedText style={[styles.blockTitle, { color: blockTextColor }]}>
                      {block.title}
                    </ThemedText>
                    <ThemedText style={[styles.blockTime, { color: blockTextColor }]}>
                      {formatRange(block.startTime, block.endTime)}
                    </ThemedText>
                    {block.tasks.length > 0 && (
                      <View style={styles.blockTasks}>
                        {block.tasks.map((task) => (
                          <ThemedText
                            key={task.id}
                            style={[styles.blockTaskItem, { color: blockTextColor }]}
                            numberOfLines={1}
                          >
                            • {task.title}
                          </ThemedText>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <View style={styles.fabContainer}>
          <IconButton
            icon={<IconSymbol name="plus.circle.fill" size={28} color="white" />}
            accessibilityLabel="Blok Yarat"
            onPress={() => setIsModalVisible(true)}
            size="large"
            circular
            backgroundColor={blockBackground}
          />
          <ThemedText style={styles.fabLabel}>Blok Yarat</ThemedText>
        </View>
      </Container>

      <CreateBlockModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleCreateBlock}
        tasks={availableTasks}
      />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  timelineWrapper: {
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 24,
    overflow: 'hidden',
  },
  hourColumn: {
    width: 72,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  hourRow: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingTop: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'transparent',
  },
  hourLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  timelineColumn: {
    flex: 1,
    position: 'relative',
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  timelineSlot: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  blockCard: {
    position: 'absolute',
    left: 12,
    right: 12,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
    elevation: 4,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  blockTime: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.85,
  },
  blockTasks: {
    marginTop: 4,
    gap: 2,
  },
  blockTaskItem: {
    fontSize: 13,
  },
  fabContainer: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    alignItems: 'center',
    gap: 8,
  },
  fabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
