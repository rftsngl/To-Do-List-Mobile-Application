/**
 * ListItem - Tek satır görev öğesi
 * Checkbox, title, due badge, 3-nokta menü
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { lightTheme, getPriorityColor, getStatusColor } from '../theme/theme';
import { formatDue, isOverdue, isToday } from '../utils/date';
import { getStatusEmoji, getPriorityEmoji } from '../utils/status';
import type { Task } from '../../src/database/types';

interface ListItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onMenuPress: (taskId: string) => void;
  onPress?: (taskId: string) => void;
  showPriority?: boolean;
  showStatus?: boolean;
}

export const ListItem: React.FC<ListItemProps> = ({
  task,
  onToggleComplete,
  onMenuPress,
  onPress,
  showPriority = true,
  showStatus = false,
}) => {
  const isCompleted = task.status === 'done';
  const isDue = task.due_date ? isOverdue(task.due_date) : false;
  const isDueToday = task.due_date ? isToday(task.due_date) : false;

  const handlePress = () => {
    if (onPress) {
      onPress(task.id);
    }
  };

  const handleToggleComplete = () => {
    onToggleComplete(task.id);
  };

  const handleMenuPress = () => {
    onMenuPress(task.id);
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isCompleted && styles.containerCompleted
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={task.title}
      accessibilityState={{ checked: isCompleted }}
    >
      {/* Sol taraf - Checkbox */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={handleToggleComplete}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isCompleted }}
        accessibilityLabel={isCompleted ? 'Tamamlandı' : 'Tamamlanmadı'}
      >
        <View style={[
          styles.checkbox,
          isCompleted && styles.checkboxCompleted
        ]}>
          {isCompleted && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Orta - İçerik */}
      <View style={styles.content}>
        {/* Başlık ve meta bilgiler */}
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              isCompleted && styles.titleCompleted
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
        </View>

        {/* Alt bilgiler */}
        {(task.description || showStatus || showPriority) && (
          <View style={styles.metaRow}>
            {task.description && (
              <Text
                style={[
                  styles.description,
                  isCompleted && styles.descriptionCompleted
                ]}
                numberOfLines={1}
              >
                {task.description}
              </Text>
            )}
            
            <View style={styles.badges}>
              {showStatus && (
                <View style={[
                  styles.badge,
                  { backgroundColor: getStatusColor(task.status, lightTheme) + '20' }
                ]}>
                  <Text style={styles.badgeText}>
                    {getStatusEmoji(task.status)}
                  </Text>
                </View>
              )}
              
              {showPriority && task.priority > 1 && (
                <View style={[
                  styles.badge,
                  { backgroundColor: getPriorityColor(task.priority, lightTheme) + '20' }
                ]}>
                  <Text style={styles.badgeText}>
                    {getPriorityEmoji(task.priority)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Sağ taraf - Due date ve menu */}
      <View style={styles.rightSection}>
        {/* Due date badge */}
        {task.due_date && (
          <View style={[
            styles.dueBadge,
            isDue && styles.dueBadgeOverdue,
            isDueToday && styles.dueBadgeToday,
            isCompleted && styles.dueBadgeCompleted
          ]}>
            <Text style={[
              styles.dueBadgeText,
              isDue && styles.dueBadgeTextOverdue,
              isDueToday && styles.dueBadgeTextToday,
              isCompleted && styles.dueBadgeTextCompleted
            ]}>
              {formatDue(task.due_date)}
            </Text>
          </View>
        )}

        {/* Menu butonu */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleMenuPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Görev menüsü"
          accessibilityHint="Görev seçeneklerini açmak için dokunun"
        >
          <Text style={styles.menuIcon}>⋯</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// Stilleri
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.surface,
    paddingVertical: lightTheme.spacing.sm,
    paddingHorizontal: lightTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.border,
    minHeight: 64,
  },
  containerCompleted: {
    opacity: 0.7,
  },
  checkboxContainer: {
    paddingRight: lightTheme.spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: lightTheme.colors.borderSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: lightTheme.colors.surface,
  },
  checkboxCompleted: {
    borderColor: lightTheme.colors.success,
    backgroundColor: lightTheme.colors.success,
  },
  checkmark: {
    fontSize: 14,
    fontWeight: 'bold',
    color: lightTheme.colors.surface,
  },
  content: {
    flex: 1,
    paddingRight: lightTheme.spacing.sm,
  },
  titleRow: {
    marginBottom: 2,
  },
  title: {
    ...lightTheme.typography.body,
    color: lightTheme.colors.text,
    fontWeight: '500',
  },
  titleCompleted: {
    color: lightTheme.colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  description: {
    ...lightTheme.typography.bodySmall,
    color: lightTheme.colors.textSecondary,
    flex: 1,
  },
  descriptionCompleted: {
    color: lightTheme.colors.textTertiary,
  },
  badges: {
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: lightTheme.ui.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 60,
  },
  dueBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: lightTheme.ui.borderRadius.sm,
    backgroundColor: lightTheme.colors.surfaceSecondary,
    marginBottom: 4,
  },
  dueBadgeToday: {
    backgroundColor: lightTheme.colors.accent + '20',
  },
  dueBadgeOverdue: {
    backgroundColor: lightTheme.colors.error + '20',
  },
  dueBadgeCompleted: {
    backgroundColor: lightTheme.colors.success + '20',
  },
  dueBadgeText: {
    ...lightTheme.typography.labelSmall,
    color: lightTheme.colors.textSecondary,
  },
  dueBadgeTextToday: {
    color: lightTheme.colors.accent,
    fontWeight: '600',
  },
  dueBadgeTextOverdue: {
    color: lightTheme.colors.error,
    fontWeight: '600',
  },
  dueBadgeTextCompleted: {
    color: lightTheme.colors.success,
  },
  menuButton: {
    width: lightTheme.ui.minTouchTarget,
    height: lightTheme.ui.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: lightTheme.ui.borderRadius.sm,
  },
  menuIcon: {
    fontSize: 16,
    color: lightTheme.colors.textSecondary,
    fontWeight: 'bold',
    transform: [{ rotate: '90deg' }],
  },
});
