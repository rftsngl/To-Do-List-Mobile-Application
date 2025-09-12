/**
 * EmptyState - Animated empty states for different scenarios
 * Tasks empty, filtered empty, search empty, etc.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
// Reanimated devre dışı - stability için
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   withSequence,
//   withDelay,
//   withTiming,
//   interpolate,
// } from 'react-native-reanimated';
import { lightTheme } from '../theme/theme';
import type { SegmentOption } from './SegmentedControl';

interface EmptyStateProps {
  type: 'all' | 'filtered' | 'search' | 'segment';
  segment?: SegmentOption;
  onActionPress?: () => void;
  actionText?: string;
}

const getEmptyContent = (type: string, segment?: SegmentOption) => {
  switch (type) {
    case 'all':
      return {
        icon: '📝',
        title: 'Henüz görev yok',
        subtitle: 'İlk görevinizi oluşturmak için + butonuna dokunun',
        actionText: 'Yeni Görev Ekle',
      };
    case 'filtered':
      return {
        icon: '🔍',
        title: 'Bu etikette görev yok',
        subtitle: 'Seçili etikete ait herhangi bir görev bulunamadı',
        actionText: 'Tüm Görevleri Göster',
      };
    case 'search':
      return {
        icon: '❓',
        title: 'Sonuç bulunamadı',
        subtitle: 'Arama kriterlerinize uygun görev bulunamadı',
        actionText: 'Aramayı Temizle',
      };
    case 'segment':
      switch (segment) {
        case 'Today':
          return {
            icon: '📅',
            title: 'Bugün için görev yok',
            subtitle: 'Bugüne planlanmış herhangi bir görev bulunmuyor',
            actionText: 'Bugün İçin Görev Ekle',
          };
        case 'Upcoming':
          return {
            icon: '⏰',
            title: 'Yaklaşan görev yok',
            subtitle: 'Gelecek için planlanmış görev bulunmuyor',
            actionText: 'Yeni Görev Planla',
          };
        case 'Overdue':
          return {
            icon: '⚠️',
            title: 'Geciken görev yok',
            subtitle: 'Harika! Tüm görevlerin zamanında',
            actionText: 'Yeni Görev Ekle',
          };
        case 'Done':
          return {
            icon: '✅',
            title: 'Tamamlanan görev yok',
            subtitle: 'Henüz tamamladığın bir görev bulunmuyor',
            actionText: 'Yeni Görev Ekle',
          };
        default:
          return {
            icon: '📋',
            title: 'Bu kategoride görev yok',
            subtitle: 'Seçili kategoriye ait görev bulunmuyor',
            actionText: 'Yeni Görev Ekle',
          };
      }
    default:
      return {
        icon: '📝',
        title: 'Görev yok',
        subtitle: 'Henüz herhangi bir görev bulunmuyor',
        actionText: 'Yeni Görev Ekle',
      };
  }
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  segment,
  onActionPress,
  actionText,
}) => {
  const content = getEmptyContent(type, segment);
  const finalActionText = actionText || content.actionText;

  // Animation values devre dışı - stability için
  // const iconScale = useSharedValue(0);
  // const titleOpacity = useSharedValue(0);
  // const titleTranslateY = useSharedValue(20);
  // const subtitleOpacity = useSharedValue(0);
  // const subtitleTranslateY = useSharedValue(20);
  // const buttonOpacity = useSharedValue(0);
  // const buttonScale = useSharedValue(0.8);

  // useEffect(() => {
  //   // Staggered entrance animation
  //   iconScale.value = withDelay(
  //     100,
  //     withSpring(1, { damping: 15, stiffness: 150 })
  //   );
  //   // ... diğer animasyonlar
  // }, []);

  // Animated styles devre dışı - stability için
  // const iconAnimatedStyle = useAnimatedStyle(() => ({
  //   transform: [{ scale: iconScale.value }],
  // }));

  // const titleAnimatedStyle = useAnimatedStyle(() => ({
  //   opacity: titleOpacity.value,
  //   transform: [{ translateY: titleTranslateY.value }],
  // }));

  // const subtitleAnimatedStyle = useAnimatedStyle(() => ({
  //   opacity: subtitleOpacity.value,
  //   transform: [{ translateY: subtitleTranslateY.value }],
  // }));

  // const buttonAnimatedStyle = useAnimatedStyle(() => ({
  //   opacity: buttonOpacity.value,
  //   transform: [{ scale: buttonScale.value }],
  // }));

  const handleActionPress = () => {
    // Animasyon devre dışı - stability için
    // buttonScale.value = withSequence(
    //   withTiming(0.95, { duration: 100 }),
    //   withSpring(1, { damping: 15, stiffness: 200 })
    // );
    
    if (onActionPress) {
      onActionPress();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>
        {content.icon}
      </Text>
      
      <Text style={styles.title}>
        {content.title}
      </Text>
      
      <Text style={styles.subtitle}>
        {content.subtitle}
      </Text>
      
      {onActionPress && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleActionPress}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>
            {finalActionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: lightTheme.spacing.xl,
    paddingVertical: lightTheme.spacing.xl * 2,
  },
  icon: {
    fontSize: 64,
    marginBottom: lightTheme.spacing.lg,
  },
  title: {
    ...lightTheme.typography.h3,
    color: lightTheme.colors.text,
    textAlign: 'center',
    marginBottom: lightTheme.spacing.sm,
  },
  subtitle: {
    ...lightTheme.typography.body,
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: lightTheme.spacing.xl,
  },
  actionButton: {
    backgroundColor: lightTheme.colors.primary,
    paddingHorizontal: lightTheme.spacing.lg,
    paddingVertical: lightTheme.spacing.md,
    borderRadius: lightTheme.ui.borderRadius.lg,
    ...lightTheme.ui.shadow.sm,
  },
  actionButtonText: {
    ...lightTheme.typography.button,
    color: lightTheme.colors.surface,
    fontWeight: '600',
    textAlign: 'center',
  },
});
