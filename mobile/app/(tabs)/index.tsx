import { useRouter } from 'expo-router';
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
import { SafeAreaView } from 'react-native-safe-area-context';

import type { FocusBlock, ProjectWithResources, ResourceItem } from '@/components/modules/home';
import { PlannerSection, ProjectCard } from '@/components/modules/home';
import { IconButton, PrimaryButton, SecondaryButton } from '@/components/shared/buttons';
import type { PickerOption } from '@/components/shared/forms';
import { Picker, TextField } from '@/components/shared/forms';
import { SafeAreaWrapper } from '@/components/shared/layout';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Task } from '@/types';

type TaskPriority = Task['priority'];
type ResourceType = ResourceItem['type'];

const PRIORITY_OPTIONS: PickerOption[] = [
  { label: 'Yakın Vade', value: 'high' },
  { label: 'Orta Vade', value: 'medium' },
  { label: 'Uzun Vade', value: 'low' },
];

const RESOURCE_TYPE_OPTIONS: PickerOption[] = [
  { label: 'Link', value: 'link' },
  { label: 'Not', value: 'note' },
];

const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const createDateLabel = (daysAhead = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
};

const createInitialProjects = (): ProjectWithResources[] => {
  const projectAId = 'project-a';
  const projectBId = 'project-b';
  const taskA1 = 'task-a-1';
  const taskA2 = 'task-a-2';
  const taskB1 = 'task-b-1';
  const taskB2 = 'task-b-2';

  return [
    {
      id: projectAId,
      title: 'Proje A - Tasarım',
      description: 'Mobil dashboard arayüzünü güncelle ve yeni modülleri hazırla.',
      color: '#FF6B6B',
      createdAt: new Date(),
      tasks: [
        {
          id: taskA1,
          title: 'Wireframe revizyonu',
          description: 'Paydaş geri bildirimleri doğrultusunda ana ekranı güncelle.',
          priority: 'high',
          completed: false,
          projectId: projectAId,
          createdAt: new Date(),
        },
        {
          id: taskA2,
          title: 'UI kit prototipi',
          description: 'Yeni komponentleri Figma kütüphanesine ekle.',
          priority: 'medium',
          completed: false,
          projectId: projectAId,
          createdAt: new Date(),
        },
      ],
      resources: [
        {
          id: 'resource-a-1',
          title: 'Figma dosyası',
          type: 'link',
          url: 'https://figma.com/file/focus-suite',
        },
        {
          id: 'resource-a-2',
          title: 'Toplantı notları',
          type: 'note',
          url: '',
          note: '12 Eylül toplantısında alınan kararlar dokümana işlendi.',
        },
      ],
    },
    {
      id: projectBId,
      title: 'Proje B - İç Eğitim',
      description: 'Ekibin odak çalışma alışkanlıklarını güçlendirecek eğitim planı.',
      color: '#34C759',
      createdAt: new Date(),
      tasks: [
        {
          id: taskB1,
          title: 'Eğitim içeriği yazımı',
          description: 'Pomodoro yönteminin temellerini anlatan bölüm hazırla.',
          priority: 'medium',
          completed: false,
          projectId: projectBId,
          createdAt: new Date(),
        },
        {
          id: taskB2,
          title: 'Kaynak listesi derle',
          description: 'Okuma önerileri ve podcast bağlantılarını topla.',
          priority: 'low',
          completed: false,
          projectId: projectBId,
          createdAt: new Date(),
        },
      ],
      resources: [
        {
          id: 'resource-b-1',
          title: 'Paylaşım planı',
          type: 'note',
          url: '',
          note: 'Slack #focus-kanalı için haftalık paylaşım takvimi taslağı.',
        },
      ],
    },
  ];
};

const createInitialBlocks = (): FocusBlock[] => {
  const tomorrow = createDateLabel(1);
  return [
    {
      id: 'block-1',
      title: 'Sabah Odak Bloğu',
      date: tomorrow,
      startTime: '09:00',
      endTime: '11:00',
      taskIds: ['task-a-1', 'task-b-1'],
      note: 'Öncelikli tasarım revizyonu ve eğitim içeriği hazırlığı.',
    },
    {
      id: 'block-2',
      title: 'Öğleden Sonra Bloğu',
      date: tomorrow,
      startTime: '14:00',
      endTime: '16:00',
      taskIds: ['task-a-2'],
    },
  ];
};

const getDefaultBlockForm = () => ({
  title: '',
  date: createDateLabel(1),
  startTime: '09:00',
  endTime: '10:30',
  note: '',
});

const sanitizeTask = (task: Task): Task => ({
  ...task,
  title: task.title.trim(),
  description: task.description?.trim() || undefined,
});

const sanitizeResource = (resource: ResourceItem): ResourceItem => ({
  ...resource,
  title: resource.title.trim(),
  url: resource.type === 'link' ? resource.url.trim() : '',
  note: resource.type === 'note' ? resource.note?.trim() || undefined : undefined,
});

const sanitizeProject = (project: ProjectWithResources): ProjectWithResources => ({
  ...project,
  title: project.title.trim(),
  description: project.description?.trim() || undefined,
  tasks: project.tasks
    .filter((task) => task.title?.trim())
    .map((task) => sanitizeTask(task)),
  resources: project.resources
    .filter((resource) => resource.title?.trim())
    .map(sanitizeResource),
});

const sanitizeProjects = (projects: ProjectWithResources[]) =>
  projects
    .filter((project) => project.title?.trim())
    .map(sanitizeProject);

const sanitizeBlock = (block: FocusBlock): FocusBlock | null => {
  const title = block.title.trim();
  if (!title) return null;

  return {
    ...block,
    title,
    note: block.note?.trim() || undefined,
    taskIds: Array.from(new Set(block.taskIds.filter(Boolean))),
  };
};

const sanitizeBlocks = (blocks: FocusBlock[]) =>
  blocks
    .map(sanitizeBlock)
    .filter((block): block is FocusBlock => block !== null);

interface FormModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}

const FormModal: React.FC<FormModalProps> = ({ visible, title, onClose, children, footer }) => {
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor }]}> 
        <View style={styles.modalHeader}>
          <ThemedText type="title" style={styles.modalTitle}>
            {title}
          </ThemedText>
          <IconButton
            icon={<IconSymbol name="chevron.down" size={20} color={iconColor} />}
            accessibilityLabel="Formu kapat"
            onPress={onClose}
            size="small"
            style={styles.modalCloseButton}
          />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBody}
        >
          <ScrollView
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
          <View style={styles.modalFooter}>{footer}</View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  const [projects, setProjects] = React.useState<ProjectWithResources[]>(() =>
    sanitizeProjects(createInitialProjects()),
  );
  const [blocks, setBlocks] = React.useState<FocusBlock[]>(() =>
    sanitizeBlocks(createInitialBlocks()),
  );

  const [projectModalVisible, setProjectModalVisible] = React.useState(false);
  const [projectForm, setProjectForm] = React.useState({ title: '', description: '' });
  const [projectFormError, setProjectFormError] = React.useState<string | undefined>();

  const [taskModalState, setTaskModalState] = React.useState<{ visible: boolean; projectId: string | null }>({
    visible: false,
    projectId: null,
  });
  const [taskForm, setTaskForm] = React.useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
  });
  const [taskFormError, setTaskFormError] = React.useState<string | undefined>();

  const [resourceModalState, setResourceModalState] = React.useState<{ visible: boolean; projectId: string | null }>({
    visible: false,
    projectId: null,
  });
  const [resourceForm, setResourceForm] = React.useState({
    title: '',
    type: 'link' as ResourceType,
    url: '',
    note: '',
  });
  const [resourceFormError, setResourceFormError] = React.useState<string | undefined>();

  const [blockModalVisible, setBlockModalVisible] = React.useState(false);
  const [blockForm, setBlockForm] = React.useState(getDefaultBlockForm);
  const [blockFormError, setBlockFormError] = React.useState<string | undefined>();

  const [assignmentModal, setAssignmentModal] = React.useState<{
    visible: boolean;
    blockId: string | null;
    selected: Set<string>;
  }>({ visible: false, blockId: null, selected: new Set() });

  const openProjectModal = React.useCallback(() => {
    setProjectForm({ title: '', description: '' });
    setProjectFormError(undefined);
    setProjectModalVisible(true);
  }, []);

  const closeProjectModal = React.useCallback(() => {
    setProjectModalVisible(false);
  }, []);

  const handleSubmitProject = React.useCallback(() => {
    const title = projectForm.title.trim();
    if (!title) {
      setProjectFormError('Parent adı gerekli.');
      return;
    }

    const newProject: ProjectWithResources = {
      id: createId('project'),
      title,
      description: projectForm.description.trim() || undefined,
      color: undefined,
      createdAt: new Date(),
      tasks: [],
      resources: [],
    };

    setProjects((prev) => sanitizeProjects([newProject, ...prev]));
    setProjectModalVisible(false);
  }, [projectForm.description, projectForm.title]);

  const openTaskModal = React.useCallback((projectId: string, priority: TaskPriority = 'medium') => {
    setTaskModalState({ visible: true, projectId });
    setTaskForm({ title: '', description: '', priority });
    setTaskFormError(undefined);
  }, []);

  const closeTaskModal = React.useCallback(() => {
    setTaskModalState({ visible: false, projectId: null });
  }, []);

  const handleSubmitTask = React.useCallback(() => {
    if (!taskModalState.projectId) return;

    const title = taskForm.title.trim();
    if (!title) {
      setTaskFormError('Görev başlığı gerekli.');
      return;
    }

    const newTask: Task = {
      id: createId('task'),
      title,
      description: taskForm.description.trim() || undefined,
      priority: taskForm.priority,
      completed: false,
      projectId: taskModalState.projectId,
      createdAt: new Date(),
    };

    setProjects((prev) =>
      sanitizeProjects(
        prev.map((project) =>
          project.id === taskModalState.projectId
            ? { ...project, tasks: [newTask, ...project.tasks] }
            : project,
        ),
      ),
    );

    setTaskModalState({ visible: false, projectId: null });
  }, [taskForm.description, taskForm.priority, taskForm.title, taskModalState.projectId]);

  const handleToggleTask = React.useCallback((projectId: string, taskId: string) => {
    setProjects((prev) =>
      sanitizeProjects(
        prev.map((project) =>
          project.id !== projectId
            ? project
            : {
                ...project,
                tasks: project.tasks.map((task) =>
                  task.id === taskId ? { ...task, completed: !task.completed } : task,
                ),
              },
        ),
      ),
    );
  }, []);

  const handleDeleteTask = React.useCallback((projectId: string, taskId: string) => {
    setProjects((prev) =>
      sanitizeProjects(
        prev.map((project) =>
          project.id !== projectId
            ? project
            : {
                ...project,
                tasks: project.tasks.filter((task) => task.id !== taskId),
              },
        ),
      ),
    );

    setBlocks((prev) =>
      sanitizeBlocks(
        prev.map((block) =>
          block.taskIds.includes(taskId)
            ? { ...block, taskIds: block.taskIds.filter((id) => id !== taskId) }
            : block,
        ),
      ),
    );
  }, []);

  const handleDeleteProject = React.useCallback((projectId: string) => {
    setProjects((prevProjects) => {
      const projectToRemove = prevProjects.find((project) => project.id === projectId);
      if (!projectToRemove) return prevProjects;

      const taskIdsToRemove = new Set(projectToRemove.tasks.map((task) => task.id));

      if (taskIdsToRemove.size > 0) {
        setBlocks((prevBlocks) =>
          sanitizeBlocks(
            prevBlocks.map((block) => ({
              ...block,
              taskIds: block.taskIds.filter((taskId) => !taskIdsToRemove.has(taskId)),
            })),
          ),
        );
      }

      return sanitizeProjects(prevProjects.filter((project) => project.id !== projectId));
    });
  }, []);

  const openResourceModal = React.useCallback((projectId: string) => {
    setResourceModalState({ visible: true, projectId });
    setResourceForm({ title: '', type: 'link', url: '', note: '' });
    setResourceFormError(undefined);
  }, []);

  const closeResourceModal = React.useCallback(() => {
    setResourceModalState({ visible: false, projectId: null });
  }, []);

  const handleSubmitResource = React.useCallback(() => {
    if (!resourceModalState.projectId) return;

    const title = resourceForm.title.trim();
    if (!title) {
      setResourceFormError('Kaynak başlığı gerekli.');
      return;
    }

    if (resourceForm.type === 'link' && !resourceForm.url.trim()) {
      setResourceFormError('Lütfen geçerli bir bağlantı ekle.');
      return;
    }

    const resource: ResourceItem = {
      id: createId('resource'),
      title,
      type: resourceForm.type,
      url: resourceForm.type === 'link' ? resourceForm.url.trim() : '',
      note: resourceForm.type === 'note' ? resourceForm.note.trim() || undefined : undefined,
    };

    setProjects((prev) =>
      sanitizeProjects(
        prev.map((project) =>
          project.id === resourceModalState.projectId
            ? { ...project, resources: [resource, ...project.resources] }
            : project,
        ),
      ),
    );

    setResourceModalState({ visible: false, projectId: null });
  }, [resourceForm.note, resourceForm.title, resourceForm.type, resourceForm.url, resourceModalState.projectId]);

  const handleDeleteResource = React.useCallback((projectId: string, resourceId: string) => {
    setProjects((prev) =>
      sanitizeProjects(
        prev.map((project) =>
          project.id !== projectId
            ? project
            : {
                ...project,
                resources: project.resources.filter((resource) => resource.id !== resourceId),
              },
        ),
      ),
    );
  }, []);

  const openBlockModal = React.useCallback(() => {
    setBlockForm(getDefaultBlockForm());
    setBlockFormError(undefined);
    setBlockModalVisible(true);
  }, []);

  const closeBlockModal = React.useCallback(() => {
    setBlockModalVisible(false);
  }, []);

  const handleSubmitBlock = React.useCallback(() => {
    const title = blockForm.title.trim();
    if (!title) {
      setBlockFormError('Blok adı gerekli.');
      return;
    }

    const newBlock: FocusBlock = {
      id: createId('block'),
      title,
      date: blockForm.date || createDateLabel(1),
      startTime: blockForm.startTime || '09:00',
      endTime: blockForm.endTime || '10:00',
      taskIds: [],
      note: blockForm.note.trim() ? blockForm.note.trim() : undefined,
    };

    setBlocks((prev) => sanitizeBlocks([...prev, newBlock]));
    setBlockModalVisible(false);
  }, [blockForm.date, blockForm.endTime, blockForm.note, blockForm.startTime, blockForm.title]);

  const handleDeleteBlock = React.useCallback((blockId: string) => {
    setBlocks((prev) => sanitizeBlocks(prev.filter((block) => block.id !== blockId)));
  }, []);

  const openAssignmentModal = React.useCallback((blockId: string) => {
    const block = blocks.find((item) => item.id === blockId);
    setAssignmentModal({
      visible: true,
      blockId,
      selected: new Set(block?.taskIds ?? []),
    });
  }, [blocks]);

  const closeAssignmentModal = React.useCallback(() => {
    setAssignmentModal({ visible: false, blockId: null, selected: new Set() });
  }, []);

  const toggleAssignedTask = React.useCallback((taskId: string) => {
    setAssignmentModal((prev) => {
      if (!prev.blockId) return prev;
      const nextSelected = new Set(prev.selected);
      if (nextSelected.has(taskId)) {
        nextSelected.delete(taskId);
      } else {
        nextSelected.add(taskId);
      }
      return { ...prev, selected: nextSelected };
    });
  }, []);

  const confirmAssignments = React.useCallback(() => {
    if (!assignmentModal.blockId) return;
    const selectedIds = Array.from(assignmentModal.selected);

    setBlocks((prev) =>
      sanitizeBlocks(
        prev.map((block) =>
          block.id === assignmentModal.blockId ? { ...block, taskIds: selectedIds } : block,
        ),
      ),
    );

    closeAssignmentModal();
  }, [assignmentModal.blockId, assignmentModal.selected, closeAssignmentModal]);

  const handleStartBlock = React.useCallback(() => {
    router.push('/(tabs)/timer');
  }, [router]);

  const tasksById = React.useMemo(() => {
    const map: Record<string, { id: string; title: string; projectTitle?: string; completed: boolean }> = {};
    projects.forEach((project) => {
      project.tasks.forEach((task) => {
        map[task.id] = {
          id: task.id,
          title: task.title,
          projectTitle: project.title,
          completed: task.completed,
        };
      });
    });
    return map;
  }, [projects]);

  return (
    <SafeAreaWrapper>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <ThemedText type="title" style={styles.heroTitle}>
            Odaklı çalışma için kontrol panelin
          </ThemedText>
          <ThemedText style={styles.heroSubtitle}>
            Proje veya kişiler bazında parent’lar oluştur, görevlerini önceliklendir ve yarınki çalışma bloklarını planla.
          </ThemedText>
          <View style={styles.heroActions}>
            <PrimaryButton
              title="Parent oluştur"
              onPress={openProjectModal}
              icon={<IconSymbol name="plus.circle.fill" size={20} color="white" />}
            />
            <SecondaryButton
              title="Çalışma bloğu planla"
              onPress={openBlockModal}
              icon={<IconSymbol name="timer" size={20} color={tintColor} />}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle">Projeler & Parent’lar</ThemedText>
            <SecondaryButton
              title="Yeni parent"
              size="small"
              onPress={openProjectModal}
            />
          </View>

          {projects.length === 0 ? (
            <ThemedText style={styles.emptyState}>
              Henüz parent eklenmedi. Öncelikli işlerini gruplayarak başlamayı dene.
            </ThemedText>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onAddTask={openTaskModal}
                onAddResource={openResourceModal}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onDeleteResource={handleDeleteResource}
                onDeleteProject={handleDeleteProject}
              />
            ))
          )}
        </View>

        <View style={styles.section}>
          <PlannerSection
            blocks={blocks}
            tasksById={tasksById}
            onAddBlock={openBlockModal}
            onAssignTasks={openAssignmentModal}
            onStartBlock={handleStartBlock}
            onDeleteBlock={handleDeleteBlock}
          />
        </View>
      </ScrollView>

      <FormModal
        visible={projectModalVisible}
        title="Parent oluştur"
        onClose={closeProjectModal}
        footer={(
          <View style={styles.modalActions}>
            <SecondaryButton title="İptal" onPress={closeProjectModal} />
            <PrimaryButton title="Kaydet" onPress={handleSubmitProject} />
          </View>
        )}
      >
        <TextField
          label="Parent adı"
          placeholder="Örn. Proje A"
          value={projectForm.title}
          onChangeText={(text) => setProjectForm((prev) => ({ ...prev, title: text }))}
          required
          error={projectFormError}
        />
        <TextField
          label="Açıklama"
          placeholder="Kısa bir not ekle"
          value={projectForm.description}
          onChangeText={(text) => setProjectForm((prev) => ({ ...prev, description: text }))}
          multiline
          numberOfLines={3}
        />
      </FormModal>

      <FormModal
        visible={taskModalState.visible}
        title="Görev ekle"
        onClose={closeTaskModal}
        footer={(
          <View style={styles.modalActions}>
            <SecondaryButton title="İptal" onPress={closeTaskModal} />
            <PrimaryButton title="Kaydet" onPress={handleSubmitTask} />
          </View>
        )}
      >
        <TextField
          label="Görev başlığı"
          placeholder="Ne yapmalısın?"
          value={taskForm.title}
          onChangeText={(text) => setTaskForm((prev) => ({ ...prev, title: text }))}
          required
          error={taskFormError}
        />
        <TextField
          label="Detay"
          placeholder="İstersen kısa bir not ekle"
          value={taskForm.description}
          onChangeText={(text) => setTaskForm((prev) => ({ ...prev, description: text }))}
          multiline
          numberOfLines={3}
        />
        <Picker
          label="Öncelik"
          value={taskForm.priority}
          onValueChange={(value) =>
            setTaskForm((prev) => ({ ...prev, priority: value as TaskPriority }))
          }
          options={PRIORITY_OPTIONS}
        />
      </FormModal>

      <FormModal
        visible={resourceModalState.visible}
        title="Kaynak ekle"
        onClose={closeResourceModal}
        footer={(
          <View style={styles.modalActions}>
            <SecondaryButton title="İptal" onPress={closeResourceModal} />
            <PrimaryButton title="Kaydet" onPress={handleSubmitResource} />
          </View>
        )}
      >
        <TextField
          label="Başlık"
          placeholder="Kaynağı nasıl adlandırmak istersin?"
          value={resourceForm.title}
          onChangeText={(text) => setResourceForm((prev) => ({ ...prev, title: text }))}
          required
          error={resourceFormError}
        />
        <Picker
          label="Tür"
          value={resourceForm.type}
          onValueChange={(value) =>
            setResourceForm((prev) => ({ ...prev, type: value as ResourceType }))
          }
          options={RESOURCE_TYPE_OPTIONS}
        />
        {resourceForm.type === 'link' ? (
          <TextField
            label="URL"
            placeholder="https://"
            value={resourceForm.url}
            onChangeText={(text) => setResourceForm((prev) => ({ ...prev, url: text }))}
            keyboardType="default"
          />
        ) : (
          <TextField
            label="Not"
            placeholder="Kısa hatırlatmalar veya toplantı notları"
            value={resourceForm.note}
            onChangeText={(text) => setResourceForm((prev) => ({ ...prev, note: text }))}
            multiline
            numberOfLines={4}
          />
        )}
      </FormModal>

      <FormModal
        visible={blockModalVisible}
        title="Çalışma bloğu oluştur"
        onClose={closeBlockModal}
        footer={(
          <View style={styles.modalActions}>
            <SecondaryButton title="İptal" onPress={closeBlockModal} />
            <PrimaryButton title="Kaydet" onPress={handleSubmitBlock} />
          </View>
        )}
      >
        <TextField
          label="Blok başlığı"
          placeholder="Örn. Sabah odak bloğu"
          value={blockForm.title}
          onChangeText={(text) => setBlockForm((prev) => ({ ...prev, title: text }))}
          required
          error={blockFormError}
        />
        <TextField
          label="Tarih"
          placeholder="2025-09-30"
          value={blockForm.date}
          onChangeText={(text) => setBlockForm((prev) => ({ ...prev, date: text }))}
        />
        <View style={styles.inlineFields}>
          <TextField
            label="Başlangıç"
            placeholder="09:00"
            value={blockForm.startTime}
            onChangeText={(text) => setBlockForm((prev) => ({ ...prev, startTime: text }))}
            style={styles.inlineField}
          />
          <TextField
            label="Bitiş"
            placeholder="10:30"
            value={blockForm.endTime}
            onChangeText={(text) => setBlockForm((prev) => ({ ...prev, endTime: text }))}
            style={styles.inlineField}
          />
        </View>
        <TextField
          label="Not"
          placeholder="Birkaç hatırlatma ekleyebilirsin"
          value={blockForm.note}
          onChangeText={(text) => setBlockForm((prev) => ({ ...prev, note: text }))}
          multiline
          numberOfLines={3}
        />
      </FormModal>

      <FormModal
        visible={assignmentModal.visible}
        title="Görev ata"
        onClose={closeAssignmentModal}
        footer={(
          <View style={styles.modalActions}>
            <SecondaryButton title="İptal" onPress={closeAssignmentModal} />
            <PrimaryButton title="Kaydet" onPress={confirmAssignments} />
          </View>
        )}
      >
        {projects.length === 0 ? (
          <ThemedText style={styles.emptyState}>
            Görev atamak için önce parent ve görev oluşturmalısın.
          </ThemedText>
        ) : (
          <View style={styles.selectorList}>
            {projects.map((project) => (
              <View key={project.id} style={styles.selectorGroup}>
                <ThemedText style={styles.selectorHeader}>{project.title}</ThemedText>
                {project.tasks.length === 0 ? (
                  <ThemedText style={styles.selectorEmpty}>
                    Bu parent için görev bulunmuyor.
                  </ThemedText>
                ) : (
                  project.tasks.map((task) => {
                    const isSelected = assignmentModal.selected.has(task.id);
                    return (
                      <Pressable
                        key={task.id}
                        style={[
                          styles.selectorItem,
                          isSelected && {
                            borderColor: tintColor,
                            backgroundColor: `${tintColor}1A`,
                          },
                        ]}
                        onPress={() => toggleAssignedTask(task.id)}
                        accessibilityRole="button"
                        accessibilityLabel={`${task.title} görevini ${isSelected ? 'çıkar' : 'ekle'}`}
                      >
                        <IconSymbol
                          name={isSelected ? 'checkmark.circle.fill' : 'circle'}
                          size={20}
                          color={isSelected ? tintColor : iconColor}
                        />
                        <View style={styles.selectorTexts}>
                          <ThemedText style={styles.selectorLabel}>{task.title}</ThemedText>
                          <ThemedText style={styles.selectorSubtitle}>
                            {PRIORITY_OPTIONS.find((option) => option.value === task.priority)?.label}
                          </ThemedText>
                        </View>
                      </Pressable>
                    );
                  })
                )}
              </View>
            ))}
          </View>
        )}
      </FormModal>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
    gap: 32,
  },
  hero: {
    gap: 16,
  },
  heroTitle: {
    marginBottom: 0,
  },
  heroSubtitle: {
    fontSize: 15,
    opacity: 0.75,
    lineHeight: 22,
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emptyState: {
    fontSize: 14,
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalCloseButton: {
    borderWidth: 0,
  },
  modalBody: {
    flex: 1,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  inlineFields: {
    flexDirection: 'row',
    gap: 12,
  },
  inlineField: {
    flex: 1,
  },
  selectorList: {
    gap: 20,
  },
  selectorGroup: {
    gap: 8,
  },
  selectorHeader: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectorEmpty: {
    fontSize: 13,
    opacity: 0.6,
  },
  selectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  selectorTexts: {
    flex: 1,
  },
  selectorLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  selectorSubtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
});
