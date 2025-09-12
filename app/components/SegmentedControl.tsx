/**
 * Segmented Control - Yatay segment seçici
 * Seçenekler: All, Today, Upcoming, Overdue, Done
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { lightTheme } from '../theme/theme';

// Segment seçenekleri
export type SegmentOption = 'All' | 'Today' | 'Upcoming' | 'Overdue' | 'Done';

interface SegmentedControlProps {
  options: SegmentOption[];
  selectedValue: SegmentOption;
  onValueChange: (value: SegmentOption) => void;
  style?: any;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = React.memo(({
  options,
  selectedValue,
  onValueChange,
  style,
}) => {
  const animatedValue = React.useRef(new Animated.Value(1)).current;

  const getSegmentLabel = (option: SegmentOption): string => {
    switch (option) {
      case 'All': return 'Tümü';
      case 'Today': return 'Bugün';
      case 'Upcoming': return 'Yaklaşan';
      case 'Overdue': return 'Geciken';
      case 'Done': return 'Tamam';
      default: return option;
    }
  };

  const getSegmentCount = (_option: SegmentOption): number | null => {
    // Bu sayılar parent component'ten gelecek, şimdilik null
    return null;
  };

  const handleSegmentPress = (option: SegmentOption) => {
    // Smooth scale animation
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onValueChange(option);
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[
        styles.segmentContainer,
        {
          transform: [{ scale: animatedValue }]
        }
      ]}>
        {options.map((option, index) => {
          const isSelected = selectedValue === option;
          const isFirst = index === 0;
          const isLast = index === options.length - 1;
          const count = getSegmentCount(option);

          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.segment,
                isSelected && styles.segmentActive,
                isFirst && styles.segmentFirst,
                isLast && styles.segmentLast,
              ]}
              onPress={() => handleSegmentPress(option)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={getSegmentLabel(option)}
            >
              <View style={styles.segmentContent}>
                <Text style={[
                  styles.segmentText,
                  isSelected && styles.segmentTextActive
                ]}>
                  {getSegmentLabel(option)}
                </Text>
                {count !== null && count > 0 && (
                  <View style={[
                    styles.badge,
                    isSelected && styles.badgeActive
                  ]}>
                    <Text style={[
                      styles.badgeText,
                      isSelected && styles.badgeTextActive
                    ]}>
                      {count > 99 ? '99+' : count}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );
});

// Varsayılan seçenekler
export const defaultSegmentOptions: SegmentOption[] = [
  'All', 'Today', 'Upcoming', 'Overdue', 'Done'
];

// Stilleri
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: lightTheme.spacing.md,
    paddingVertical: lightTheme.spacing.sm,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: lightTheme.colors.surfaceSecondary,
    borderRadius: lightTheme.ui.borderRadius.md,
    padding: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: lightTheme.ui.minTouchTarget,
    borderRadius: lightTheme.ui.borderRadius.md - 2,
  },
  segmentFirst: {
    // İlk segment özel stilleri
  },
  segmentLast: {
    // Son segment özel stilleri  
  },
  segmentActive: {
    backgroundColor: lightTheme.colors.surface,
    shadowColor: lightTheme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
  },
  segmentTextActive: {
    color: lightTheme.colors.primary,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: lightTheme.colors.textTertiary,
    borderRadius: lightTheme.ui.borderRadius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeActive: {
    backgroundColor: lightTheme.colors.primary,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: lightTheme.colors.surface,
  },
  badgeTextActive: {
    color: lightTheme.colors.surface,
  },
});
