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
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lightTheme } from '@theme/theme';

interface FABProps {
  onPress: () => void;
  icon?: string;
  style?: any;
  disabled?: boolean;
}

export const FAB: React.FC<FABProps> = ({
  onPress,
  icon = '+',
  style,
  disabled = false,
}) => {
  const safeAreaInsets = useSafeAreaInsets();
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
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
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <TouchableOpacity
          style={[
            styles.fab,
            disabled && styles.fabDisabled
          ]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
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
      </Animated.View>
    </View>
  );
};

// Stilleri
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: lightTheme.ui.zIndex.fab,
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
