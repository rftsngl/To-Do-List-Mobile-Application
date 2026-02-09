/**
 * SkeletonLoader - Loading states için shimmer effect
 * Task list, labels, ve diğer content için placeholder
 */

import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { lightTheme } from '../theme/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

const SkeletonItem: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 4,
  style,
}) => {
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    shimmerValue.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      true
    );
  }, [shimmerValue]);

  const shimmerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmerValue.value, [0, 1], [0.3, 0.7]);
    return { opacity };
  });

  return (
    <View style={[styles.skeleton, { width, height, borderRadius }, style]}>
      <Animated.View style={[styles.shimmer, shimmerStyle]} />
    </View>
  );
};

// Task List Skeleton
export const TaskListSkeleton: React.FC = () => (
  <View style={styles.container}>
    {Array.from({ length: 8 }).map((_, index) => (
      <View key={index} style={styles.taskSkeleton}>
        {/* Checkbox */}
        <SkeletonItem width={24} height={24} borderRadius={12} />
        
        {/* Content */}
        <View style={styles.taskContent}>
          <SkeletonItem width="70%" height={18} style={styles.titleSkeleton} />
          <SkeletonItem width="45%" height={14} />
        </View>
        
        {/* Menu */}
        <SkeletonItem width={24} height={24} borderRadius={12} />
      </View>
    ))}
  </View>
);

// Labels Skeleton
export const LabelsSkeleton: React.FC = () => (
  <View style={styles.labelsContainer}>
    <SkeletonItem width={100} height={32} borderRadius={16} />
    <SkeletonItem width={80} height={32} borderRadius={16} />
    <SkeletonItem width={90} height={32} borderRadius={16} />
    <SkeletonItem width={70} height={32} borderRadius={16} />
  </View>
);

// Segment Control Skeleton
export const SegmentSkeleton: React.FC = () => (
  <View style={styles.segmentContainer}>
    <SkeletonItem width="100%" height={44} borderRadius={8} />
  </View>
);

// Combined Loading State
export const TasksLoadingSkeleton: React.FC = () => (
  <View style={styles.fullContainer}>
    <SegmentSkeleton />
    <LabelsSkeleton />
    <TaskListSkeleton />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: lightTheme.spacing.md,
  },
  fullContainer: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  skeleton: {
    backgroundColor: lightTheme.colors.surfaceSecondary,
    overflow: 'hidden',
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: lightTheme.colors.surface,
  },
  taskSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: lightTheme.spacing.sm,
    paddingHorizontal: lightTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.border,
    minHeight: 64,
  },
  taskContent: {
    flex: 1,
    marginLeft: lightTheme.spacing.sm,
    marginRight: lightTheme.spacing.sm,
  },
  titleSkeleton: {
    marginBottom: 8,
  },
  labelsContainer: {
    flexDirection: 'row',
    paddingHorizontal: lightTheme.spacing.md,
    paddingVertical: lightTheme.spacing.sm,
    gap: lightTheme.spacing.sm,
  },
  segmentContainer: {
    paddingHorizontal: lightTheme.spacing.md,
    paddingVertical: lightTheme.spacing.sm,
  },
});
