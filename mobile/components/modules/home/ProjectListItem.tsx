import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/shared/layout';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

import type { ProjectWithResources } from './ProjectCard';

interface ProjectListItemProps {
  project: ProjectWithResources;
  onPress: (projectId: string) => void;
}

export const ProjectListItem: React.FC<ProjectListItemProps> = ({ project, onPress }) => {
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const surfaceVariant = useThemeColor({}, 'surfaceVariant');
  const textColor = useThemeColor({}, 'text');

  const accentColor = project.color ?? tintColor;
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((task) => task.completed).length;
  const pendingTasks = Math.max(0, totalTasks - completedTasks);
  const resourceCount = project.resources.length;

  return (
    <Card
      pressable
      onPress={() => onPress(project.id)}
      radius={16}
      padding={18}
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.colorDot, { backgroundColor: accentColor }]} />
          <ThemedText type="subtitle" style={styles.title}>
            {project.title}
          </ThemedText>
        </View>
        <View style={styles.metaTag}>
          <IconSymbol name="calendar" size={14} color={iconColor} />
          <ThemedText style={styles.metaText}>
            {new Date(project.createdAt).toLocaleDateString('tr-TR', {
              day: '2-digit',
              month: 'short',
            })}
          </ThemedText>
        </View>
      </View>

      {project.description ? (
        <ThemedText style={[styles.description, { color: textColor, opacity: 0.75 }]} numberOfLines={2}>
          {project.description}
        </ThemedText>
      ) : null}

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: surfaceVariant, borderColor: outlineVariant }]}>
          <IconSymbol name="checkmark.circle" size={18} color={iconColor} />
          <View style={styles.statTexts}>
            <ThemedText style={styles.statLabel}>Tamamlanan</ThemedText>
            <ThemedText style={styles.statValue}>
              {completedTasks}/{totalTasks}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.statCard, { backgroundColor: surfaceVariant, borderColor: outlineVariant }]}>
          <IconSymbol name="arrowtriangle.right.circle" size={18} color={iconColor} />
          <View style={styles.statTexts}>
            <ThemedText style={styles.statLabel}>Bekleyen</ThemedText>
            <ThemedText style={styles.statValue}>{pendingTasks}</ThemedText>
          </View>
        </View>

        <View style={[styles.statCard, { backgroundColor: surfaceVariant, borderColor: outlineVariant }]}>
          <IconSymbol name="link" size={18} color={iconColor} />
          <View style={styles.statTexts}>
            <ThemedText style={styles.statLabel}>Kaynak</ThemedText>
            <ThemedText style={styles.statValue}>{resourceCount}</ThemedText>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    paddingRight: 12,
  },
  title: {
    marginBottom: 0,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  metaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  metaText: {
    fontSize: 12,
    opacity: 0.8,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  statTexts: {
    gap: 2,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
