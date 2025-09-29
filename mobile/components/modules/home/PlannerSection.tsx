import React from 'react';
import { StyleSheet, View } from 'react-native';

import { IconButton, PrimaryButton, SecondaryButton } from '@/components/shared/buttons';
import { Card } from '@/components/shared/layout';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface FocusBlock {
  id: string;
  title: string;
  date: string; // ISO date string
  startTime: string;
  endTime: string;
  taskIds: string[];
  note?: string;
}

interface TaskSummary {
  id: string;
  title: string;
  projectTitle?: string;
  completed: boolean;
}

interface PlannerSectionProps {
  blocks: FocusBlock[];
  tasksById: Record<string, TaskSummary>;
  onAddBlock: () => void;
  onAssignTasks: (blockId: string) => void;
  onStartBlock: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
}

export const PlannerSection: React.FC<PlannerSectionProps> = ({
  blocks,
  tasksById,
  onAddBlock,
  onAssignTasks,
  onStartBlock,
  onDeleteBlock,
}) => {
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const successColor = useThemeColor({}, 'success');

  const formatDate = (date: string) => {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString('tr-TR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLabel}>
          <IconSymbol name="calendar" size={20} color={tintColor} />
          <ThemedText type="subtitle">Yarını Planla</ThemedText>
        </View>
        <PrimaryButton
          title="Blok oluştur"
          size="small"
          onPress={onAddBlock}
          icon={<IconSymbol name="plus.circle.fill" size={18} color="white" />}
        />
      </View>

      {blocks.length === 0 ? (
        <Card style={styles.emptyCard}>
          <ThemedText style={styles.emptyText}>
            Henüz çalışma bloğu planlamadın. Sabah ve öğleden sonra için bloklar oluşturup görevlerini ata.
          </ThemedText>
          <SecondaryButton
            title="İlk bloğunu planla"
            onPress={onAddBlock}
            fullWidth
            style={styles.emptyButton}
          />
        </Card>
      ) : (
        <View style={styles.blockList}>
          {blocks.map((block) => {
            const attachedTasks = block.taskIds.map((taskId) => tasksById[taskId]).filter(Boolean);
            const completedCount = attachedTasks.filter((task) => task.completed).length;

            return (
              <Card key={block.id} style={styles.blockCard}>
                <View style={styles.blockHeader}>
                  <View style={styles.blockInfo}>
                    <ThemedText type="subtitle" style={styles.blockTitle}>
                      {block.title}
                    </ThemedText>
                    <View style={styles.blockMetaRow}>
                      <View style={styles.blockMeta}>
                        <IconSymbol name="calendar" size={16} color={iconColor} />
                        <ThemedText style={styles.blockMetaText}>
                          {formatDate(block.date)}
                        </ThemedText>
                      </View>
                      <View style={styles.blockMeta}>
                        <IconSymbol name="timer" size={16} color={iconColor} />
                        <ThemedText style={styles.blockMetaText}>
                          {block.startTime} - {block.endTime}
                        </ThemedText>
                      </View>
                      {attachedTasks.length > 0 && (
                        <View style={styles.blockMeta}>
                          <IconSymbol name="flag.fill" size={16} color={successColor} />
                          <ThemedText style={styles.blockMetaText}>
                            {completedCount}/{attachedTasks.length} görev
                          </ThemedText>
                        </View>
                      )}
                    </View>

                    {block.note ? (
                      <ThemedText style={styles.blockNote}>
                        {block.note}
                      </ThemedText>
                    ) : null}
                  </View>

                  <IconButton
                    icon={<IconSymbol name="trash.fill" size={20} color={iconColor} />}
                    accessibilityLabel={`${block.title} bloğunu sil`}
                    onPress={() => onDeleteBlock(block.id)}
                    size="small"
                  />
                </View>

                <View style={styles.taskSection}>
                  <View style={styles.taskSectionHeader}>
                    <ThemedText style={styles.taskSectionTitle}>Atanan Görevler</ThemedText>
                    <SecondaryButton
                      title={attachedTasks.length === 0 ? 'Görev ata' : 'Görevleri düzenle'}
                      size="small"
                      onPress={() => onAssignTasks(block.id)}
                    />
                  </View>

                  {attachedTasks.length === 0 ? (
                    <ThemedText style={styles.emptyText}>Görev atanmamış.</ThemedText>
                  ) : (
                    <View style={styles.taskList}>
                      {attachedTasks.map((task) => (
                        <View key={task.id} style={styles.taskRow}>
                          <View style={styles.taskBadge}>
                            <IconSymbol
                              name={task.completed ? 'checkmark.circle.fill' : 'circle'}
                              size={18}
                              color={task.completed ? successColor : iconColor}
                            />
                          </View>
                          <View style={styles.taskTexts}>
                            <ThemedText style={styles.taskTitle}>{task.title}</ThemedText>
                            {task.projectTitle && (
                              <ThemedText style={styles.taskSubtitle}>
                                {task.projectTitle}
                              </ThemedText>
                            )}
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                <PrimaryButton
                  title="Zamanlayıcıyı başlat"
                  onPress={() => onStartBlock(block.id)}
                  fullWidth
                  icon={<IconSymbol name="play.fill" size={20} color="white" />}
                />
              </Card>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  blockList: {
    gap: 16,
  },
  blockCard: {
    padding: 20,
    gap: 16,
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  blockInfo: {
    flex: 1,
    gap: 8,
  },
  blockTitle: {
    marginBottom: 0,
  },
  blockMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  blockMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  blockMetaText: {
    fontSize: 13,
    opacity: 0.75,
  },
  blockNote: {
    fontSize: 13,
    opacity: 0.75,
  },
  taskSection: {
    gap: 12,
  },
  taskSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  taskList: {
    gap: 12,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  taskBadge: {
    width: 24,
    alignItems: 'center',
  },
  taskTexts: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  taskSubtitle: {
    fontSize: 13,
    opacity: 0.75,
  },
  emptyCard: {
    padding: 20,
    gap: 16,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.7,
  },
  emptyButton: {
    marginTop: 8,
  },
});
