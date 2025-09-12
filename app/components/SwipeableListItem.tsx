/**
 * SwipeableListItem - Swipe gestures ile task actions
 * Sol swipe: Complete/Uncomplete
 * Sağ swipe: Delete
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import { lightTheme } from '../theme/theme';
import { ListItem } from './ListItem';
import { HapticFeedback } from '../utils/haptics';
import type { Task } from '../../src/database/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25; // 25% of screen width
const DELETE_THRESHOLD = SCREEN_WIDTH * 0.4; // 40% for delete

interface SwipeableListItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onMenuPress: (taskId: string) => void;
  onPress?: (taskId: string) => void;
  showPriority?: boolean;
  showStatus?: boolean;
}

export const SwipeableListItem: React.FC<SwipeableListItemProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onMenuPress,
  onPress,
  showPriority = true,
  showStatus = false,
}) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const handleSwipeComplete = () => {
    HapticFeedback.taskComplete();
    onToggleComplete(task.id);
    // Reset position after action
    translateX.value = withSpring(0);
  };

  const handleSwipeDelete = () => {
    HapticFeedback.taskDelete();
    // Animate out then delete
    opacity.value = withTiming(0, { duration: 300 });
    translateX.value = withTiming(-SCREEN_WIDTH, { duration: 300 }, () => {
      runOnJS(onDelete)(task.id);
    });
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
    })
    .onUpdate((event) => {
      'worklet';
      translateX.value = event.translationX;
      
      // Trigger haptic at threshold
      const shouldComplete = event.translationX > SWIPE_THRESHOLD;
      const shouldDelete = event.translationX < -DELETE_THRESHOLD;
      
      if (shouldComplete || shouldDelete) {
        runOnJS(HapticFeedback.swipeThreshold)();
      }
    })
    .onEnd((event) => {
      'worklet';
      const shouldComplete = event.translationX > SWIPE_THRESHOLD;
      const shouldDelete = event.translationX < -DELETE_THRESHOLD;

      if (shouldDelete) {
        runOnJS(handleSwipeDelete)();
      } else if (shouldComplete) {
        runOnJS(handleSwipeComplete)();
      } else {
        // Snap back to center
        translateX.value = withSpring(0);
      }
    });

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const completeActionStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0.8, 1.2],
      'clamp'
    );
    const actionOpacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD * 0.5],
      [0, 1],
      'clamp'
    );

    return {
      transform: [{ scale }],
      opacity: actionOpacity,
    };
  });

  const deleteActionStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      [-DELETE_THRESHOLD, 0],
      [1.2, 0.8],
      'clamp'
    );
    const actionOpacity = interpolate(
      translateX.value,
      [-DELETE_THRESHOLD * 0.5, 0],
      [1, 0],
      'clamp'
    );

    return {
      transform: [{ scale }],
      opacity: actionOpacity,
    };
  });

  const backgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      translateX.value,
      [-DELETE_THRESHOLD, 0, SWIPE_THRESHOLD],
      [lightTheme.colors.error, lightTheme.colors.surface, lightTheme.colors.success]
    );

    return { backgroundColor };
  });

  return (
    <View style={styles.container}>
      {/* Background Actions */}
      <Animated.View style={[styles.background, backgroundStyle]}>
        {/* Complete Action (Right side) */}
        <Animated.View style={[styles.completeAction, completeActionStyle]}>
          <Text style={styles.completeIcon}>
            {task.status === 'done' ? '↶' : '✓'}
          </Text>
          <Text style={styles.actionText}>
            {task.status === 'done' ? 'Geri Al' : 'Tamam'}
          </Text>
        </Animated.View>

        {/* Delete Action (Left side) */}
        <Animated.View style={[styles.deleteAction, deleteActionStyle]}>
          <Text style={styles.deleteIcon}>🗑️</Text>
          <Text style={styles.actionText}>Sil</Text>
        </Animated.View>
      </Animated.View>

      {/* Main Content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={containerAnimatedStyle}>
          <ListItem
            task={task}
            onToggleComplete={onToggleComplete}
            onMenuPress={onMenuPress}
            onPress={onPress}
            showPriority={showPriority}
            showStatus={showStatus}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: lightTheme.spacing.lg,
  },
  completeAction: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  deleteAction: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  completeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  deleteIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: lightTheme.colors.surface,
    textAlign: 'center',
  },
});
