import type { FocusBlock, ProjectWithResources, ResourceItem } from '@/components/modules/home';
import type { Task } from '@/types';

const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export const createDateLabel = (daysAhead = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
};

export const createInitialProjects = (): ProjectWithResources[] => {
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

export const createInitialBlocks = (): FocusBlock[] => {
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

export const buildTaskLookup = (projects: ProjectWithResources[]) => {
  return projects.reduce<Record<string, Task>>((acc, project) => {
    project.tasks.forEach((task) => {
      acc[task.id] = task;
    });
    return acc;
  }, {});
};

export const listAllTasks = (projects: ProjectWithResources[]) => {
  return projects.flatMap((project) =>
    project.tasks.map((task) => ({
      ...task,
      projectTitle: project.title,
    })),
  );
};

export const addResourceNote = (
  resources: ResourceItem[],
  resourceId: string,
  note: string,
): ResourceItem[] =>
  resources.map((resource) =>
    resource.id === resourceId
      ? {
          ...resource,
          note,
        }
      : resource,
  );
