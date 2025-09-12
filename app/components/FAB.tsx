/**
 * Floating Action Button - Sağ altta daire + butonu
 * Safe area ve gölge desteği ile
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
// Reanimated devre dışı - stability için
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   withSequence,
//   withTiming,
//   interpolate,
// } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lightTheme } from '../theme/theme';
import { HapticFeedback } from '../utils/haptics';

interface FABProps {
  onPress: () => void;
  icon?: string;
  style?: any;
  disabled?: boolean;
}

export const FAB: React.FC<FABProps> = React.memo(({
  onPress,
  icon = '+',
  style,
  disabled = false,
}) => {
  const safeAreaInsets = useSafeAreaInsets();
  
  // Reanimated animasyonlar devre dışı - stability için
  // const scale = useSharedValue(1);
  // const rotation = useSharedValue(0);
  // const rippleScale = useSharedValue(0);

  const handlePress = () => {
    HapticFeedback.buttonPress();
    onPress();
  };

  return (
    <View style={[
      styles.container,
      {
        bottom: lightTheme.spacing.md + (safeAreaInsets.bottom || 0),
        right: lightTheme.spacing.md,
      },
      style
    ]}>
      <TouchableOpacity
        style={[
          styles.fab,
          disabled && styles.fabDisabled
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel="Yeni görev ekle"
        accessibilityHint="Yeni görev oluşturmak için dokunun"
      >
        <Text style={[
          styles.icon,
          disabled && styles.iconDisabled
        ]}>
          {icon}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

// Stilleri
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: lightTheme.ui.zIndex.fab,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: lightTheme.colors.primary,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: lightTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...lightTheme.ui.shadow.lg,
  },
  fabDisabled: {
    backgroundColor: lightTheme.colors.textDisabled,
    ...lightTheme.ui.shadow.sm,
  },
  icon: {
    fontSize: 24,
    fontWeight: '300',
    color: lightTheme.colors.surface,
    lineHeight: 24,
  },
  iconDisabled: {
    color: lightTheme.colors.textTertiary,
  },
});
