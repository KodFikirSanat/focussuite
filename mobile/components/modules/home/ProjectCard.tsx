import React from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import { IconButton, PrimaryButton, SecondaryButton } from '@/components/shared/buttons';
import { Card } from '@/components/shared/layout';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Project, ResourceLink, Task } from '@/types';

export interface ResourceItem extends ResourceLink {
  note?: string;
}

export interface ProjectWithResources extends Project {
  resources: ResourceItem[];
}

interface ProjectCardProps {
  project: ProjectWithResources;
  onAddTask: (projectId: string, priority?: Task['priority']) => void;
  onAddResource: (projectId: string) => void;
  onViewResource: (projectId: string, resourceId: string) => void;
  onEditResource: (projectId: string, resource: ResourceItem) => void;
  onToggleTask: (projectId: string, taskId: string) => void;
  onDeleteTask: (projectId: string, taskId: string) => void;
  onDeleteResource: (projectId: string, resourceId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onOpenDetails?: (projectId: string) => void;
  showTasks?: boolean;
}

const PRIORITY_LABELS: Record<Task['priority'], string> = {
  high: 'Yakın Vade',
  medium: 'Orta Vade',
  low: 'Uzun Vade',
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onAddTask,
  onAddResource,
  onViewResource,
  onEditResource,
  onToggleTask,
  onDeleteTask,
  onDeleteResource,
  onDeleteProject,
  onOpenDetails,
  showTasks = true,
}) => {
  const dangerColor = useThemeColor({}, 'danger');
  const warningColor = useThemeColor({}, 'warning');
  const successColor = useThemeColor({}, 'success');
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const surfaceVariant = useThemeColor({}, 'surfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const { width } = useWindowDimensions();
  const isCompact = width < 768;

  const groupedTasks = React.useMemo(() => ({
    high: project.tasks.filter((task) => task.priority === 'high'),
    medium: project.tasks.filter((task) => task.priority === 'medium'),
    low: project.tasks.filter((task) => task.priority === 'low'),
  }), [project.tasks]);

  const priorityAccent: Record<Task['priority'], string> = {
    high: dangerColor,
    medium: warningColor,
    low: successColor,
  };

  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((task) => task.completed).length;
  const pendingTasks = Math.max(0, totalTasks - completedTasks);

  const getPriorityBackground = (priority: Task['priority']) => hexToRgba(priorityAccent[priority], 0.12);

  const getTaskBackground = (priority: Task['priority'], completed: boolean) =>
    completed ? hexToRgba(successColor, 0.14) : getPriorityBackground(priority);

  const priorityTextColor = priorityAccent;

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <ThemedText type="subtitle" style={styles.projectTitle}>
            {project.title}
          </ThemedText>
          {project.description && (
            <ThemedText style={styles.projectDescription}>
              {project.description}
            </ThemedText>
          )}
        </View>
        <IconButton
          icon={<IconSymbol name="trash.fill" size={20} color={iconColor} />}
          accessibilityLabel={`${project.title} projesini sil`}
          onPress={() => onDeleteProject(project.id)}
          size="small"
        />
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <IconSymbol name="calendar" size={16} color={iconColor} />
          <ThemedText style={styles.metaLabel}>
            {new Date(project.createdAt).toLocaleDateString('tr-TR', {
              day: '2-digit',
              month: 'short',
            })}
          </ThemedText>
        </View>
        {project.tasks.length > 0 && (
          <View style={styles.metaItem}>
            <IconSymbol name="flag.fill" size={16} color={iconColor} />
            <ThemedText style={styles.metaLabel}>
              {project.tasks.filter((task) => task.completed).length}/{project.tasks.length} tamamlandı
            </ThemedText>
          </View>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionLabel}>
          <IconSymbol name="link" size={18} color={tintColor} />
          <ThemedText style={styles.sectionTitle}>Kaynaklar</ThemedText>
        </View>
        <SecondaryButton
          title="Kaynak ekle"
          size="small"
          onPress={() => onAddResource(project.id)}
        />
      </View>

      {project.resources.length === 0 ? (
        <ThemedText style={styles.emptyText}>
          Henüz kaynak eklenmedi.
        </ThemedText>
      ) : (
        <View style={styles.resourceList}>
          {project.resources.map((resource) => (
            <View key={resource.id} style={styles.resourceItem}>
              <View style={styles.resourceContent}>
                <IconSymbol
                  name={resource.type === 'link' ? 'link' : 'note.text'}
                  size={16}
                  color={tintColor}
                />
                <View style={styles.resourceTexts}>
                  <ThemedText style={styles.resourceTitle}>{resource.title}</ThemedText>
                  {resource.type === 'link' && resource.url ? (
                    <ThemedText style={styles.resourceSubtitle} numberOfLines={1}>
                      {resource.url}
                    </ThemedText>
                  ) : null}
                  {resource.type === 'note' && resource.note ? (
                    <ThemedText style={styles.resourceSubtitle} numberOfLines={2}>
                      {resource.note}
                    </ThemedText>
                  ) : null}
                </View>
              </View>
              <View style={styles.resourceActions}>
                <IconButton
                  icon={<IconSymbol name="info.circle" size={18} color={iconColor} />}
                  accessibilityLabel={`${resource.title} kaynağı detaylarını görüntüle`}
                  onPress={() => onViewResource(project.id, resource.id)}
                  size="small"
                  style={styles.resourceActionButton}
                />
                <IconButton
                  icon={<IconSymbol name="square.and.pencil" size={18} color={iconColor} />}
                  accessibilityLabel={`${resource.title} kaynağını düzenle`}
                  onPress={() => onEditResource(project.id, resource)}
                  size="small"
                  style={styles.resourceActionButton}
                />
                <IconButton
                  icon={<IconSymbol name="trash.fill" size={18} color={iconColor} />}
                  accessibilityLabel={`${resource.title} kaynağını sil`}
                  onPress={() => onDeleteResource(project.id, resource.id)}
                  size="small"
                  style={styles.resourceActionButton}
                />
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={[styles.sectionHeader, styles.taskHeader]}>
        <View style={styles.sectionLabel}>
          <IconSymbol name="doc.text" size={18} color={tintColor} />
          <ThemedText style={styles.sectionTitle}>Görevler</ThemedText>
        </View>
        <PrimaryButton
          title="Görev ekle"
          size="small"
          onPress={() => onAddTask(project.id)}
          icon={<IconSymbol name="plus.circle.fill" size={18} color="white" />}
        />
      </View>
      {showTasks ? (
        <View style={[styles.taskGroups, isCompact && styles.taskGroupsStacked]}>
          {(Object.keys(groupedTasks) as Task['priority'][]).map((priority) => (
            <View
              key={priority}
              style={[styles.priorityColumn, isCompact && styles.priorityColumnStacked]}
            >
              <View style={styles.priorityHeader}>
                <ThemedText style={[styles.priorityLabel, { color: priorityTextColor[priority] }]}>
                  {PRIORITY_LABELS[priority]}
                </ThemedText>
                <View
                  style={[styles.priorityCountBadge, { backgroundColor: hexToRgba(priorityAccent[priority], 0.12) }]}
                >
                  <ThemedText style={[styles.priorityCount, { color: priorityAccent[priority] }]}>
                    {groupedTasks[priority].length}
                  </ThemedText>
                </View>
              </View>

              {groupedTasks[priority].length === 0 ? (
                <Pressable
                  style={[
                    styles.emptyAction,
                    {
                      backgroundColor: hexToRgba(priorityAccent[priority], 0.1),
                      borderColor: hexToRgba(priorityAccent[priority], 0.2),
                    },
                  ]}
                  onPress={() => onAddTask(project.id, priority)}
                  accessibilityRole="button"
                  accessibilityLabel={`${PRIORITY_LABELS[priority]} için görev ekle`}
                >
                  <IconSymbol
                    name="plus.circle.fill"
                    size={18}
                    color={priorityAccent[priority]}
                  />
                  <ThemedText
                    style={[styles.emptyActionText, { color: priorityAccent[priority] }]}
                  >
                    Görev ekle
                  </ThemedText>
                </Pressable>
              ) : (
                groupedTasks[priority].map((task) => (
                  <Pressable
                    key={task.id}
                    style={[
                      styles.taskItem,
                      {
                        backgroundColor: getTaskBackground(priority, task.completed),
                        borderColor: hexToRgba(priorityAccent[priority], 0.18),
                      },
                      task.completed && styles.taskItemCompleted,
                    ]}
                    onPress={() => onToggleTask(project.id, task.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`${task.title} görevini ${task.completed ? 'geri al' : 'tamamla'}`}
                  >
                    <View
                      style={[
                        styles.taskStatus,
                        {
                          borderColor: task.completed
                            ? 'transparent'
                            : hexToRgba(priorityAccent[priority], 0.6),
                          backgroundColor: task.completed
                            ? successColor
                            : hexToRgba(priorityAccent[priority], 0.2),
                        },
                      ]}
                    >
                      {task.completed && (
                        <IconSymbol name="checkmark" size={14} color="white" />
                      )}
                    </View>

                    <View style={styles.taskTexts}>
                      <ThemedText style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                        {task.title}
                      </ThemedText>
                      {task.description && (
                        <ThemedText style={styles.taskDescription} numberOfLines={2}>
                          {task.description}
                        </ThemedText>
                      )}
                    </View>

                    <IconButton
                      icon={<IconSymbol name="trash.fill" size={18} color={iconColor} />}
                      accessibilityLabel={`${task.title} görevini sil`}
                      onPress={() => onDeleteTask(project.id, task.id)}
                      size="small"
                      style={styles.taskDeleteButton}
                    />
                  </Pressable>
                ))
              )}
            </View>
          ))}
        </View>
      ) : (
        <View
          style={[
            styles.taskPreview,
            { backgroundColor: surfaceVariant, borderColor: outlineVariant },
          ]}
        >
          <View style={styles.taskPreviewStats}>
            <View style={styles.taskPreviewStat}>
              <ThemedText style={styles.taskPreviewStatLabel}>Toplam</ThemedText>
              <ThemedText style={styles.taskPreviewStatValue}>{totalTasks}</ThemedText>
            </View>
            <View style={styles.taskPreviewStat}>
              <ThemedText style={styles.taskPreviewStatLabel}>Tamamlanan</ThemedText>
              <ThemedText style={styles.taskPreviewStatValue}>{completedTasks}</ThemedText>
            </View>
            <View style={styles.taskPreviewStat}>
              <ThemedText style={styles.taskPreviewStatLabel}>Bekleyen</ThemedText>
              <ThemedText style={styles.taskPreviewStatValue}>{pendingTasks}</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.taskPreviewHint}>
            Görev detayları parent içine girince görüntülenir.
          </ThemedText>
          {onOpenDetails ? (
            <SecondaryButton
              title="Parent detayını aç"
              size="small"
              onPress={() => onOpenDetails(project.id)}
            />
          ) : null}
        </View>
      )}
    </Card>
  );
};

const hexToRgba = (hex: string, alpha: number) => {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  const normalized = hex.replace('#', '');
  const bigint = Number.parseInt(normalized.length === 3 ? normalized.repeat(2) : normalized, 16);
  if (Number.isNaN(bigint)) return `rgba(0,0,0,${alpha})`;
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 24,
    padding: 20,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  projectTitle: {
    marginBottom: 0,
  },
  projectDescription: {
    opacity: 0.8,
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaLabel: {
    fontSize: 13,
    opacity: 0.75,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  taskHeader: {
    marginTop: 4,
  },
  emptyText: {
    opacity: 0.7,
    fontSize: 14,
  },
  emptyAction: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  emptyActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resourceList: {
    gap: 12,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  resourceContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  resourceTexts: {
    flex: 1,
    gap: 2,
  },
  resourceTitle: {
    fontWeight: '600',
    fontSize: 14,
  },
  resourceSubtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
  resourceActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resourceActionButton: {
    borderWidth: 0,
  },
  taskGroups: {
    flexDirection: 'row',
    gap: 16,
  },
  taskGroupsStacked: {
    flexDirection: 'column',
  },
  priorityColumn: {
    flex: 1,
    gap: 12,
  },
  priorityColumnStacked: {
    width: '100%',
  },
  priorityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priorityLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  priorityCountBadge: {
    minWidth: 26,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  priorityCount: {
    fontSize: 13,
    opacity: 0.6,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  taskItemCompleted: {
    opacity: 0.9,
  },
  taskStatus: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTexts: {
    flex: 1,
    gap: 4,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskDescription: {
    fontSize: 13,
    opacity: 0.7,
  },
  taskDeleteButton: {
    borderWidth: 0,
  },
  taskPreview: {
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  taskPreviewStats: {
    flexDirection: 'row',
    gap: 16,
  },
  taskPreviewStat: {
    flex: 1,
    gap: 4,
  },
  taskPreviewStatLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  taskPreviewStatValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  taskPreviewHint: {
    fontSize: 13,
    opacity: 0.75,
  },
});
