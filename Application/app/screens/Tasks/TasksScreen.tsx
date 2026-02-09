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
import { TaskActionSheet } from '../../components/TaskActionSheet';
import { TasksLoadingSkeleton } from '../../components/SkeletonLoader';
import { EmptyState } from '../../components/EmptyState';

// Database
import {
  TasksRepository,
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
  _onTaskMenu: (taskId: string) => void;
  showDoneInAll?: boolean; // Settings'ten gelen toggle
}

export const TasksScreen: React.FC<TasksScreenProps> = React.memo(({
  onNewTask,
  onTaskPress,
  _onTaskMenu,
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
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

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
            // Tüm görevler (liste olmayan görevler dahil)
            filteredTasks = await TasksRepository.getAll({
              includeCompleted: showDoneInAll
            });
            
            if (!showDoneInAll) {
              filteredTasks = filteredTasks.filter(task => isActiveStatus(task.status));
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
            // Tamamlanmış görevler (liste olmayan görevler dahil)
            const allTasks = await TasksRepository.getAll({
              includeCompleted: true
            });
            
            filteredTasks = allTasks.filter(task => task.status === 'done');
            
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

  // Etiketleri yükle (ilk kez ve tab focus'ta)
  useEffect(() => {
    const loadLabels = async () => {
      try {
        console.log('[TasksScreen] Labels loading started');
        const labelsData = await LabelsRepository.getAll();
        console.log('[TasksScreen] Labels loaded:', { count: labelsData.length, hasLongNames: labelsData.some(l => l.name.length > 15) });
        setLabels(labelsData);
      } catch (err) {
        console.error('[TasksScreen] Etiket yükleme hatası:', err);
      }
    };
    
    loadLabels();
  }, []);

  // Tab değişikliği sonrası etiketleri yeniden yükle
  const refreshLabelsIfNeeded = useCallback(async () => {
    if (labels.length === 0) {
      try {
        const labelsData = await LabelsRepository.getAll();
        setLabels(labelsData);
      } catch (err) {
        console.error('[TasksScreen] Etiket yeniden yükleme hatası:', err);
      }
    }
  }, [labels.length]);

  // Component visible olduğunda kontrol et
  useEffect(() => {
    refreshLabelsIfNeeded();
  }, [refreshLabelsIfNeeded]);

  // Tab focus detection için force re-render
  const [refreshKey, setRefreshKey] = useState(0);
  
  useEffect(() => {
    // Tab değişikliği sonrası layout refresh
    const timer = setTimeout(() => {
      setRefreshKey(prev => prev + 1);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [labels]);

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

  // Task menüsünü aç
  const handleTaskMenu = useCallback((taskId: string) => {
    setSelectedTaskId(taskId);
    setActionSheetVisible(true);
  }, []);

  // Action sheet'i kapat
  const handleCloseActionSheet = useCallback(() => {
    setActionSheetVisible(false);
    setSelectedTaskId(null);
  }, []);

  // Görev düzenle
  const handleEditTask = useCallback((taskId: string) => {
    onTaskPress(taskId); // Görev detayına git
  }, [onTaskPress]);

  // Görev sil
  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      await TasksRepository.delete(taskId);
      await loadTasks();
    } catch (err) {
      console.error('[TasksScreen] Delete task hatası:', err);
      Alert.alert('Hata', 'Görev silinirken bir hata oluştu.');
    }
  }, [loadTasks]);

  // Görev kopyala
  const handleDuplicateTask = useCallback(async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      await TasksRepository.create({
        list_id: task.list_id,
        title: `${task.title} (Kopya)`,
        description: task.description,
        status: 'todo' as any,
        priority: task.priority,
        start_date: task.start_date,
        due_date: task.due_date,
      });

      await loadTasks();
      Alert.alert('Başarılı', 'Görev kopyalandı.');
    } catch (err) {
      console.error('[TasksScreen] Duplicate task hatası:', err);
      Alert.alert('Hata', 'Görev kopyalanırken bir hata oluştu.');
    }
  }, [tasks, loadTasks]);

  // Görev paylaş
  const handleShareTask = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Basit metin paylaşımı
    const shareText = `Görev: ${task.title}\n${task.description ? `Açıklama: ${task.description}\n` : ''}Durum: ${task.status}`;
    
    // Burada gerçek paylaşım implementasyonu olabilir
    Alert.alert('Paylaş', shareText);
  }, [tasks]);

  // Segment değişikliği
  const handleSegmentChange = useCallback((segment: SegmentOption) => {
    setSelectedSegment(segment);
  }, []);

  // Etiket filtresi değişikliği
  const handleLabelFilter = useCallback((labelId: string | null) => {
    setActiveLabel(labelId);
  }, []);

  // Etiket listesi değiştiğinde aktif etiketi kontrol et
  useEffect(() => {
    if (activeLabel && labels.length > 0) {
      const labelExists = labels.some(label => label.id === activeLabel);
      if (!labelExists) {
        setActiveLabel(null); // Etiket silinmişse filtreyi kaldır
      }
    }
  }, [labels, activeLabel]);

  // Task item render with performance optimization - stable ListItem
  const renderTask = useCallback(({ item }: { item: Task }) => (
    <ListItem
      task={item}
      onToggleComplete={handleToggleComplete}
      onMenuPress={handleTaskMenu}
      onPress={onTaskPress}
      showPriority={true}
      showStatus={selectedSegment === 'All' || selectedSegment === 'Done'}
    />
  ), [handleToggleComplete, handleTaskMenu, onTaskPress, selectedSegment]);

  // Optimized keyExtractor
  const keyExtractor = useCallback((item: Task) => item.id, []);

  // Item layout optimization (fixed height items)
  const ITEM_HEIGHT = 64; // minHeight from ListItem styles
  const getItemLayout = useCallback(
    (data: Task[] | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  // Enhanced empty state
  const renderEmpty = useCallback(() => {
    const emptyType = activeLabel ? 'filtered' : 'segment';
    
    return (
      <EmptyState
        type={emptyType}
        segment={selectedSegment}
        onActionPress={activeLabel ? () => setActiveLabel(null) : onNewTask}
        actionText={activeLabel ? 'Tüm Görevleri Göster' : undefined}
      />
    );
  }, [selectedSegment, activeLabel, onNewTask]);

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

  // Show skeleton loading during initial load
  if (loading && tasks.length === 0) {
    return <TasksLoadingSkeleton />;
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
        <View key={`labels-${refreshKey}`} style={styles.labelFilterContainer}>
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
              <Text 
                style={[
                  styles.labelChipText,
                  !activeLabel && styles.labelChipTextActive
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
                adjustsFontSizeToFit={true}
                minimumFontScale={0.8}
                onLayout={(event) => {
                  const { width } = event.nativeEvent.layout;
                  if (width < 30) { // Text kırpıldığı tespit edilirse
                    console.warn('[TasksScreen] "Tüm Etiketler" text clipped:', { width });
                  }
                }}
              >
                Tüm Etiketler
              </Text>
            </TouchableOpacity>

            {/* Individual Label Chips */}
            {labels.filter(label => label && label.name && label.id).map((label) => (
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
                <Text 
                  style={[
                    styles.labelChipText,
                    activeLabel === label.id && styles.labelChipTextActive,
                    activeLabel === label.id && {
                      color: label.color || lightTheme.colors.primary
                    }
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.8}
                  onLayout={(event) => {
                    const { width, height } = event.nativeEvent.layout;
                    if (width < 5 || height < 5) {
                      console.warn('[TasksScreen] Individual label text not visible:', { 
                        labelName: label.name, 
                        labelColor: label.color,
                        width, 
                        height,
                        activeLabel: activeLabel === label.id
                      });
                    }
                  }}
                >
                  {label.name || 'Etiket'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Task List - Performance Optimized */}
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        style={styles.list}
        contentContainerStyle={styles.listContainer}
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
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={10}
        initialNumToRender={10}
        // Prevent unnecessary re-renders
        extraData={selectedSegment}
      />

      {/* FAB */}
      <FAB
        onPress={onNewTask}
        disabled={loading}
      />

      {/* Task Action Sheet */}
      <TaskActionSheet
        isVisible={actionSheetVisible}
        onClose={handleCloseActionSheet}
        task={selectedTaskId ? tasks.find(t => t.id === selectedTaskId) || null : null}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onToggleComplete={handleToggleComplete}
        onDuplicate={handleDuplicateTask}
        onShare={handleShareTask}
      />
    </View>
  );
});


// Stilleri
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.backgroundSecondary,
  },
  list: {
    flex: 1,
  },
  listContainer: {
    flexGrow: 1,
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
    flexDirection: 'row', // Horizontal layout belirtme
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
    minWidth: 60, // Minimum genişlik garantisi
    maxWidth: 150, // Maksimum genişlik sınırı artırıldı
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
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: lightTheme.colors.textSecondary,
    flexShrink: 1, // Text alanını daraltabilir
    textAlign: 'left',
    minWidth: 20, // Minimum genişlik garantisi
  },
  labelChipTextActive: {
    color: lightTheme.colors.primary,
    fontWeight: '600',
  },
});
