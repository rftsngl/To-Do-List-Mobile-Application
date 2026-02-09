/**
 * TaskActionSheet - Görev için alttan açılan action menüsü
 * Düzenle, Sil, Tamamla, Öncelik değiştir gibi seçenekler
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { Sheet } from './Sheet';
import { lightTheme } from '../theme/theme';
import type { Task } from '../../src/database/types';

const { height: screenHeight } = Dimensions.get('window');

export interface TaskActionSheetProps {
  isVisible: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onToggleComplete?: (taskId: string) => void;
  onDuplicate?: (taskId: string) => void;
  onShare?: (taskId: string) => void;
}

interface ActionItem {
  id: string;
  title: string;
  icon: string;
  color?: string;
  destructive?: boolean;
  onPress: () => void;
}

export const TaskActionSheet: React.FC<TaskActionSheetProps> = ({
  isVisible,
  onClose,
  task,
  onEdit,
  onDelete,
  onToggleComplete,
  onDuplicate,
  onShare,
}) => {
  if (!task) {
    return (
      <Sheet
        isVisible={isVisible}
        onClose={onClose}
        height={screenHeight * 0.3}
        closeOnBackdrop={true}
      >
        <View style={styles.container}>
          <Text style={styles.taskTitle}>Görev bulunamadı</Text>
        </View>
      </Sheet>
    );
  }

  const isCompleted = task.status === 'done';

  const handleEdit = () => {
    onClose();
    onEdit?.(task.id);
  };

  const handleDelete = () => {
    onClose();
    Alert.alert(
      'Görevi Sil',
      `"${task.title}" görevi silinsin mi?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => onDelete?.(task.id),
        },
      ]
    );
  };

  const handleToggleComplete = () => {
    onClose();
    onToggleComplete?.(task.id);
  };

  const handleDuplicate = () => {
    onClose();
    onDuplicate?.(task.id);
  };

  const handleShare = () => {
    onClose();
    onShare?.(task.id);
  };

  const actions: ActionItem[] = [
    {
      id: 'edit',
      title: 'Düzenle',
      icon: '✏️',
      color: lightTheme.colors.primary,
      onPress: handleEdit,
    },
    {
      id: 'toggle',
      title: isCompleted ? 'Geri Al' : 'Tamamla',
      icon: isCompleted ? '↩️' : '✅',
      color: isCompleted ? lightTheme.colors.warning : lightTheme.colors.success,
      onPress: handleToggleComplete,
    },
    {
      id: 'duplicate',
      title: 'Kopyala',
      icon: '📋',
      color: lightTheme.colors.secondary,
      onPress: handleDuplicate,
    },
    {
      id: 'share',
      title: 'Paylaş',
      icon: '📤',
      color: lightTheme.colors.accent,
      onPress: handleShare,
    },
    {
      id: 'delete',
      title: 'Sil',
      icon: '🗑️',
      color: lightTheme.colors.error,
      destructive: true,
      onPress: handleDelete,
    },
  ];

  return (
    <Sheet
      isVisible={isVisible}
      onClose={onClose}
      height={screenHeight * 0.35}
      closeOnBackdrop={true}
    >
      <View style={styles.container}>
        {/* Compact Header */}
        <View style={styles.header}>
          <Text style={styles.taskTitle} numberOfLines={1}>
            {task.title}
          </Text>
        </View>

        {/* Compact Actions Grid */}
        <View style={styles.actionsGrid}>
          {actions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[
                styles.actionButton,
                action.destructive && styles.actionButtonDestructive,
              ]}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={[
                styles.actionLabel,
                action.destructive && { color: lightTheme.colors.error }
              ]}>
                {action.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: lightTheme.spacing.md,
  },
  header: {
    paddingBottom: lightTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.border,
    marginBottom: lightTheme.spacing.md,
  },
  taskTitle: {
    ...lightTheme.typography.body,
    color: lightTheme.colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingBottom: lightTheme.spacing.md,
    gap: lightTheme.spacing.md,
    paddingHorizontal: lightTheme.spacing.sm,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 70,
    paddingVertical: lightTheme.spacing.sm,
    paddingHorizontal: lightTheme.spacing.xs,
    borderRadius: lightTheme.ui.borderRadius.lg,
    backgroundColor: lightTheme.colors.surface,
    ...lightTheme.ui.shadow.sm,
  },
  actionButtonDestructive: {
    backgroundColor: lightTheme.colors.error + '08',
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  actionLabel: {
    ...lightTheme.typography.labelSmall,
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '500',
  },
});
