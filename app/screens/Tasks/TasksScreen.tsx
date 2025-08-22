/**
 * Tasks Screen - Ana görevler ekranı
 * SegmentedControl ile filtreleme, FAB ile yeni görev, ListItem'lar ile görevler
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  RefreshControl,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Components
import { SegmentedControl, defaultSegmentOptions, type SegmentOption } from '../../components/SegmentedControl';
import { FAB } from '../../components/FAB';
import { ListItem } from '../../components/ListItem';

// Database
import {
  TasksRepository,
  ListsRepository,
  LabelsRepository,
  type Task,
  type Label,
} from '../../../src/database';

// Utils
import { startOfToday, endOfToday, now } from '../../utils/date';
import { isActiveStatus } from '../../utils/status';

// Theme
import { lightTheme } from '../../theme/theme';

interface TasksScreenProps {
  onNewTask: () => void;
  onTaskPress: (taskId: string) => void;
  onTaskMenu: (taskId: string) => void;
  showDoneInAll?: boolean; // Settings'ten gelen toggle
}

export const TasksScreen: React.FC<TasksScreenProps> = ({
  onNewTask,
  onTaskPress,
  onTaskMenu,
  showDoneInAll = false,
}) => {
  const safeAreaInsets = useSafeAreaInsets();
  const [selectedSegment, setSelectedSegment] = useState<SegmentOption>('All');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Görevleri yükle
  const loadTasks = useCallback(async () => {
    try {
      setError(null);
      let filteredTasks: Task[] = [];

      // Etiket filtresi varsa kullan
      if (activeLabel) {
        switch (selectedSegment) {
          case 'All':
            const allLabelTasks = await TasksRepository.getByLabelAdvanced(activeLabel, {
              includeCompleted: showDoneInAll
            });
            filteredTasks = showDoneInAll ? allLabelTasks : allLabelTasks.filter(task => isActiveStatus(task.status));
            break;
          
          case 'Today':
            const todayStart = startOfToday();
            const todayEnd = endOfToday();
            const todayLabelTasks = await TasksRepository.getByLabelAdvanced(activeLabel, {
              includeCompleted: false,
              dateRange: { start: todayStart, end: todayEnd }
            });
            filteredTasks = todayLabelTasks.filter(task => isActiveStatus(task.status));
            break;

          case 'Upcoming':
            const tomorrow = endOfToday() + 1;
            const futureEnd = now() + (30 * 24 * 60 * 60 * 1000);
            const upcomingLabelTasks = await TasksRepository.getByLabelAdvanced(activeLabel, {
              includeCompleted: false,
              dateRange: { start: tomorrow, end: futureEnd }
            });
            filteredTasks = upcomingLabelTasks.filter(task => isActiveStatus(task.status));
            break;

          case 'Overdue':
            const overdueTasks = await TasksRepository.getOverdue();
            const overdueLabelTasks = [];
            for (const task of overdueTasks) {
              // Manuel etiket kontrolü - gelişmiş sorguda overdue + label birlikte zor
              const taskLabels = await LabelsRepository.getByTask(task.id);
              if (taskLabels.some(label => label.id === activeLabel)) {
                overdueLabelTasks.push(task);
              }
            }
            filteredTasks = overdueLabelTasks;
            break;

          case 'Done':
            const doneLabelTasks = await TasksRepository.getByLabelAdvanced(activeLabel, {
              status: 'done',
              includeCompleted: true
            });
            filteredTasks = doneLabelTasks.sort((a, b) => {
              const aCompleted = a.completed_at || 0;
              const bCompleted = b.completed_at || 0;
              return bCompleted - aCompleted;
            });
            break;

          default:
            filteredTasks = [];
        }
      } else {
        // Normal segment filtresi (etiket yok)
        switch (selectedSegment) {
          case 'All':
            // Tüm aktif görevler (Done gizli, showDoneInAll true ise dahil)
            // Tüm listeleri al ve görevlerini topla
            const allLists = await ListsRepository.getAll();
            let allTasks: Task[] = [];
            
            for (const list of allLists) {
              const listTasks = await TasksRepository.getByList(list.id, {
                includeCompleted: showDoneInAll
              });
              allTasks = allTasks.concat(listTasks);
            }
            
            if (showDoneInAll) {
              filteredTasks = allTasks;
            } else {
              filteredTasks = allTasks.filter(task => isActiveStatus(task.status));
            }
            break;

          case 'Today':
            // Bugün vadesi dolan aktif görevler
            const todayStart = startOfToday();
            const todayEnd = endOfToday();
            const todayTasks = await TasksRepository.getAgenda({ start: todayStart, end: todayEnd });
            filteredTasks = todayTasks.filter(task => isActiveStatus(task.status));
            break;

          case 'Upcoming':
            // Gelecek vadeli aktif görevler
            const tomorrow = endOfToday() + 1;
            const futureEnd = now() + (30 * 24 * 60 * 60 * 1000); // 30 gün sonra
            const upcomingTasks = await TasksRepository.getAgenda({ start: tomorrow, end: futureEnd });
            filteredTasks = upcomingTasks.filter(task => isActiveStatus(task.status));
            break;

          case 'Overdue':
            // Vadesi geçmiş aktif görevler
            filteredTasks = await TasksRepository.getOverdue();
            break;

          case 'Done':
            // Tamamlanmış görevler
            const doneLists = await ListsRepository.getAll();
            let doneAllTasks: Task[] = [];
            
            for (const list of doneLists) {
              const listTasks = await TasksRepository.getByList(list.id, {
                includeCompleted: true
              });
              doneAllTasks = doneAllTasks.concat(listTasks);
            }
            
            filteredTasks = doneAllTasks.filter(task => task.status === 'done');
            
            // Tamamlanma tarihine göre sırala
            filteredTasks.sort((a, b) => {
              const aCompleted = a.completed_at || 0;
              const bCompleted = b.completed_at || 0;
              return bCompleted - aCompleted; // En son tamamlanan üstte
            });
            break;

          default:
            filteredTasks = [];
        }
      }

      setTasks(filteredTasks);
    } catch (err) {
      console.error('[TasksScreen] Görev yükleme hatası:', err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedSegment, showDoneInAll, activeLabel]);

  // İlk yükleme ve segment değişikliği
  useEffect(() => {
    setLoading(true);
    loadTasks();
  }, [loadTasks]);

  // Etiketleri yükle (ilk kez)
  useEffect(() => {
    const loadLabels = async () => {
      try {
        const labelsData = await LabelsRepository.getAll();
        setLabels(labelsData);
      } catch (err) {
        console.error('[TasksScreen] Etiket yükleme hatası:', err);
      }
    };
    
    loadLabels();
  }, []);

  // Refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTasks();
  }, [loadTasks]);

  // Görevi tamamla/geri al
  const handleToggleComplete = useCallback(async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      if (task.status === 'done') {
        // Geri al - todo yap
        await TasksRepository.update(taskId, {
          status: 'todo' as any,
          completed_at: null as any,
        });
      } else {
        // Tamamla
        await TasksRepository.markDone(taskId);
      }

      // Listeyi yenile
      await loadTasks();
    } catch (err) {
      console.error('[TasksScreen] Toggle complete hatası:', err);
      Alert.alert('Hata', 'Görev durumu güncellenirken bir hata oluştu.');
    }
  }, [tasks, loadTasks]);

  // Segment değişikliği
  const handleSegmentChange = useCallback((segment: SegmentOption) => {
    setSelectedSegment(segment);
  }, []);

  // Etiket filtresi değişikliği
  const handleLabelFilter = useCallback((labelId: string | null) => {
    setActiveLabel(labelId);
  }, []);

  // Task item render
  const renderTask = useCallback(({ item }: { item: Task }) => (
    <ListItem
      task={item}
      onToggleComplete={handleToggleComplete}
      onMenuPress={onTaskMenu}
      onPress={onTaskPress}
      showPriority={true}
      showStatus={selectedSegment === 'All' || selectedSegment === 'Done'}
    />
  ), [handleToggleComplete, onTaskMenu, onTaskPress, selectedSegment]);

  // Boş liste
  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>
        {getEmptyIcon(selectedSegment)}
      </Text>
      <Text style={styles.emptyTitle}>
        {getEmptyTitle(selectedSegment)}
      </Text>
      <Text style={styles.emptyMessage}>
        {getEmptyMessage(selectedSegment)}
      </Text>
    </View>
  ), [selectedSegment]);

  // Hata durumu
  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Bir hata oluştu</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      { paddingTop: safeAreaInsets.top }
    ]}>
      {/* Segment Control */}
      <SegmentedControl
        options={defaultSegmentOptions}
        selectedValue={selectedSegment}
        onValueChange={handleSegmentChange}
      />

      {/* Label Filter Chips */}
      {labels.length > 0 && (
        <View style={styles.labelFilterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.labelFilterContent}
          >
            {/* All Labels Chip */}
            <TouchableOpacity
              style={[
                styles.labelChip,
                !activeLabel && styles.labelChipActive
              ]}
              onPress={() => handleLabelFilter(null)}
            >
              <Text style={[
                styles.labelChipText,
                !activeLabel && styles.labelChipTextActive
              ]}>
                Tüm Etiketler
              </Text>
            </TouchableOpacity>

            {/* Individual Label Chips */}
            {labels.map((label) => (
              <TouchableOpacity
                key={label.id}
                style={[
                  styles.labelChip,
                  activeLabel === label.id && styles.labelChipActive,
                  {
                    backgroundColor: activeLabel === label.id
                      ? (label.color || lightTheme.colors.primary) + '20'
                      : lightTheme.colors.surface
                  }
                ]}
                onPress={() => handleLabelFilter(label.id)}
              >
                <View style={[
                  styles.labelChipDot,
                  { backgroundColor: label.color || lightTheme.colors.primary }
                ]} />
                <Text style={[
                  styles.labelChipText,
                  activeLabel === label.id && {
                    color: label.color || lightTheme.colors.primary,
                    fontWeight: '600'
                  }
                ]}>
                  {label.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Task List */}
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={tasks.length === 0 ? styles.listEmpty : undefined}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[lightTheme.colors.primary]}
            tintColor={lightTheme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <FAB
        onPress={onNewTask}
        disabled={loading}
      />
    </View>
  );
};

// Boş liste yardımcıları
function getEmptyIcon(segment: SegmentOption): string {
  switch (segment) {
    case 'All': return '📝';
    case 'Today': return '📅';
    case 'Upcoming': return '⏰';
    case 'Overdue': return '⚠️';
    case 'Done': return '✅';
    default: return '📝';
  }
}

function getEmptyTitle(segment: SegmentOption): string {
  switch (segment) {
    case 'All': return 'Görev yok';
    case 'Today': return 'Bugün görevi yok';
    case 'Upcoming': return 'Yaklaşan görev yok';
    case 'Overdue': return 'Geciken görev yok';
    case 'Done': return 'Tamamlanan görev yok';
    default: return 'Görev yok';
  }
}

function getEmptyMessage(segment: SegmentOption): string {
  switch (segment) {
    case 'All': return 'Yeni görev eklemek için + butonuna dokunun';
    case 'Today': return 'Bugün için planlanmış bir göreviniz yok';
    case 'Upcoming': return 'Yakında vadesi dolan bir göreviniz yok';
    case 'Overdue': return 'Harika! Geciken göreviniz yok';
    case 'Done': return 'Henüz tamamlanan göreviniz yok';
    default: return '';
  }
}

// Stilleri
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.backgroundSecondary,
  },
  list: {
    flex: 1,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: lightTheme.spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: lightTheme.spacing.md,
  },
  emptyTitle: {
    ...lightTheme.typography.h3,
    color: lightTheme.colors.textSecondary,
    marginBottom: lightTheme.spacing.sm,
    textAlign: 'center',
  },
  emptyMessage: {
    ...lightTheme.typography.body,
    color: lightTheme.colors.textTertiary,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: lightTheme.spacing.xl,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: lightTheme.spacing.md,
  },
  errorTitle: {
    ...lightTheme.typography.h3,
    color: lightTheme.colors.error,
    marginBottom: lightTheme.spacing.sm,
    textAlign: 'center',
  },
  errorMessage: {
    ...lightTheme.typography.body,
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  labelFilterContainer: {
    backgroundColor: lightTheme.colors.backgroundSecondary,
    paddingVertical: lightTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.border,
  },
  labelFilterContent: {
    paddingHorizontal: lightTheme.spacing.md,
    gap: lightTheme.spacing.sm,
  },
  labelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: lightTheme.spacing.sm,
    paddingHorizontal: lightTheme.spacing.md,
    borderRadius: lightTheme.ui.borderRadius.full,
    borderWidth: 1,
    borderColor: lightTheme.colors.border,
    backgroundColor: lightTheme.colors.surface,
    minHeight: 36,
  },
  labelChipActive: {
    borderColor: lightTheme.colors.primary,
    backgroundColor: lightTheme.colors.primary + '20',
  },
  labelChipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: lightTheme.spacing.sm,
  },
  labelChipText: {
    ...lightTheme.typography.labelSmall,
    color: lightTheme.colors.textSecondary,
  },
  labelChipTextActive: {
    color: lightTheme.colors.primary,
    fontWeight: '600',
  },
});
