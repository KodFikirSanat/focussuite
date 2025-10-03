import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

import { PrimaryButton, SecondaryButton } from '@/components/shared/buttons';
import { Picker, PickerOption, TextField } from '@/components/shared/forms';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Task } from '@/types';

export interface CreateBlockPayload {
  title: string;
  startTime: string;
  endTime: string;
  taskIds: string[];
}

type PlannerTask = Task & { projectTitle?: string };

interface CreateBlockModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (payload: CreateBlockPayload) => void;
  tasks: PlannerTask[];
}

const buildTimeOptions = (): PickerOption[] => {
  const options: PickerOption[] = [];
  for (let hour = 0; hour < 24; hour += 1) {
    for (let quarter = 0; quarter < 4; quarter += 1) {
      const minutes = quarter * 15;
      const label = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      options.push({ label, value: label });
    }
  }
  return options;
};

const TIME_OPTIONS = buildTimeOptions();
const DEFAULT_START = '09:00';
const DEFAULT_END = '10:00';

export const CreateBlockModal: React.FC<CreateBlockModalProps> = ({
  visible,
  onClose,
  onSave,
  tasks,
}) => {
  const [title, setTitle] = React.useState('');
  const [startTime, setStartTime] = React.useState(DEFAULT_START);
  const [endTime, setEndTime] = React.useState(DEFAULT_END);
  const [selectedTaskIds, setSelectedTaskIds] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | undefined>();

  const backgroundColor = useThemeColor({}, 'background');
  const surfaceVariant = useThemeColor({}, 'surfaceVariant');
  const outlineVariant = useThemeColor({}, 'outlineVariant');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  React.useEffect(() => {
    if (visible) {
      setTitle('');
      setStartTime(DEFAULT_START);
      setEndTime(DEFAULT_END);
      setSelectedTaskIds([]);
      setError(undefined);
    }
  }, [visible]);

  const toggleTaskSelection = React.useCallback((taskId: string) => {
    Haptics.selectionAsync();
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  }, []);

  const handleSave = React.useCallback(() => {
    if (!title.trim()) {
      setError('Blok başlığı gerekli.');
      return;
    }

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (endMinutes <= startMinutes) {
      setError('Bitiş saati başlangıç saatinden sonra olmalıdır.');
      return;
    }

    setError(undefined);
    onSave({
      title: title.trim(),
      startTime,
      endTime,
      taskIds: selectedTaskIds,
    });
  }, [endTime, onSave, selectedTaskIds, startTime, title]);

  const assignedTasksLabel = React.useMemo(() => {
    if (selectedTaskIds.length === 0) return 'Görev seçilmedi';
    const selectedTitles = tasks
      .filter((task) => selectedTaskIds.includes(task.id))
      .map((task) => task.title);
    if (selectedTitles.length <= 2) return selectedTitles.join(', ');
    return `${selectedTitles.slice(0, 2).join(', ')} +${selectedTitles.length - 2}`;
  }, [selectedTaskIds, tasks]);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <ThemedView style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.35)' }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalWrapper}
        >
          <ThemedView style={[styles.modalContainer, { backgroundColor }]}> 
            <View style={styles.header}>
              <ThemedText type="title" style={styles.headerTitle}>
                Blok oluştur
              </ThemedText>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <IconSymbol name="chevron.down" size={20} color={textColor} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
              <TextField
                label="Blok adı"
                placeholder="Örn. Sabah egzersizi"
                value={title}
                onChangeText={setTitle}
                required
              />

              <View style={styles.row}>
                <View style={styles.flexItem}>
                  <Picker
                    label="Başlangıç"
                    value={startTime}
                    onValueChange={(value) => setStartTime(String(value))}
                    options={TIME_OPTIONS}
                    required
                  />
                </View>
                <View style={styles.spacing} />
                <View style={styles.flexItem}>
                  <Picker
                    label="Bitiş"
                    value={endTime}
                    onValueChange={(value) => setEndTime(String(value))}
                    options={TIME_OPTIONS}
                    required
                  />
                </View>
              </View>

              <View style={styles.tasksHeader}>
                <ThemedText style={styles.tasksHeaderText}>Görev seç</ThemedText>
                <ThemedText style={[styles.tasksHeaderHint, { color: tintColor }]}>
                  {assignedTasksLabel}
                </ThemedText>
              </View>

              <View style={[styles.taskList, { borderColor: outlineVariant, backgroundColor: surfaceVariant }]}>
                {tasks.map((task) => {
                  const isSelected = selectedTaskIds.includes(task.id);
                  return (
                    <Pressable
                      key={task.id}
                      style={({ pressed }) => [
                        styles.taskItem,
                        isSelected && styles.taskItemSelected,
                        pressed && styles.taskItemPressed,
                      ]}
                      onPress={() => toggleTaskSelection(task.id)}
                    >
                      <View style={styles.taskIcon}>
                        <IconSymbol
                          name={isSelected ? 'checkmark.circle.fill' : 'circle'}
                          size={22}
                          color={isSelected ? tintColor : outlineVariant}
                        />
                      </View>
                      <View style={styles.taskTextContainer}>
                        <ThemedText style={styles.taskTitle}>{task.title}</ThemedText>
                        {task.projectTitle && (
                          <ThemedText style={styles.taskProject} numberOfLines={1}>
                            {task.projectTitle}
                          </ThemedText>
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              {error && (
                <ThemedText style={styles.errorText}>
                  {error}
                </ThemedText>
              )}
            </ScrollView>

            <View style={styles.footer}>
              <SecondaryButton title="İptal" onPress={onClose} style={styles.footerButton} />
              <PrimaryButton title="Kaydet" onPress={handleSave} style={styles.footerButton} />
            </View>
          </ThemedView>
        </KeyboardAvoidingView>
      </ThemedView>
    </Modal>
  );
};

const timeToMinutes = (time: string) => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  flexItem: {
    flex: 1,
  },
  spacing: {
    width: 16,
  },
  tasksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tasksHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tasksHeaderHint: {
    fontSize: 14,
    fontWeight: '500',
  },
  taskList: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    overflow: 'hidden',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  taskItemSelected: {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  taskItemPressed: {
    opacity: 0.85,
  },
  taskIcon: {
    marginRight: 12,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  taskProject: {
    fontSize: 13,
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
  footerButton: {
    flex: 1,
  },
  errorText: {
    color: '#FF6B6B',
    marginTop: 16,
    fontSize: 14,
  },
});
