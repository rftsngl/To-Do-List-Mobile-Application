/**
 * Haptic Feedback Utilities
 * iOS ve Android için haptic feedback yönetimi
 */

import { Platform, Vibration } from 'react-native';

// Haptic feedback tipleri
export type HapticType = 
  | 'light'      // Hafif dokunma (button press)
  | 'medium'     // Orta seviye (toggle, selection)
  | 'heavy'      // Güçlü (important action, completion)
  | 'success'    // Başarı (task completed)
  | 'warning'    // Uyarı (error, delete confirmation)
  | 'error'      // Hata (failed action)
  | 'selection'  // Seçim değişikliği (segment, picker)
  | 'rigid'      // Sert dokunma (swipe threshold)
  | 'soft';      // Yumuşak dokunma (subtle feedback)

// iOS için HapticFeedback - Basit vibration fallback
const triggerIOSHaptic = (type: HapticType): void => {
  if (Platform.OS !== 'ios') return;
  
  try {
    // React Native'de native HapticFeedback yok, vibration kullan
    const duration = type === 'heavy' ? 100 : type === 'medium' ? 50 : 25;
    Vibration.vibrate(duration);
  } catch (error) {
    console.log('[Haptics] iOS vibration failed:', error);
  }
};

// Android için Vibration patterns
const getAndroidVibrationPattern = (type: HapticType): number | number[] => {
  switch (type) {
    case 'light':
    case 'soft':
      return 25;
    case 'medium':
    case 'selection':
      return 50;
    case 'heavy':
    case 'rigid':
      return 100;
    case 'success':
      return [0, 50, 100, 50]; // Short-long-short pattern
    case 'warning':
      return [0, 100, 50, 100]; // Long-short-long pattern
    case 'error':
      return [0, 200]; // Single long vibration
    default:
      return 50;
  }
};

const triggerAndroidHaptic = (type: HapticType): void => {
  if (Platform.OS !== 'android') return;
  
  try {
    const pattern = getAndroidVibrationPattern(type);
    
    if (Array.isArray(pattern)) {
      Vibration.vibrate(pattern);
    } else {
      Vibration.vibrate(pattern);
    }
  } catch (error) {
    console.log('[Haptics] Android vibration failed:', error);
  }
};

// Ana haptic trigger fonksiyonu
export const triggerHaptic = (type: HapticType): void => {
  try {
    if (Platform.OS === 'ios') {
      triggerIOSHaptic(type);
    } else if (Platform.OS === 'android') {
      triggerAndroidHaptic(type);
    }
  } catch (error) {
    console.log('[Haptics] Trigger failed:', error);
  }
};

// Specific use case helpers - Güvenli implementasyon
export const HapticFeedback = {
  // Button interactions
  buttonPress: () => {
    try {
      // Güvenli haptic feedback
      if (Platform.OS === 'android') {
        Vibration.vibrate(25);
      } else if (Platform.OS === 'ios') {
        Vibration.vibrate(25);
      }
    } catch (error) {
      console.log('[Haptic] buttonPress failed:', error);
    }
  },
  buttonLongPress: () => {
    try {
      triggerHaptic('medium');
    } catch (error) {
      console.log('[Haptic] buttonLongPress failed:', error);
    }
  },
  
  // Task actions
  taskComplete: () => {
    try {
      triggerHaptic('success');
    } catch (error) {
      console.log('[Haptic] taskComplete failed:', error);
    }
  },
  taskUncomplete: () => {
    try {
      triggerHaptic('medium');
    } catch (error) {
      console.log('[Haptic] taskUncomplete failed:', error);
    }
  },
  taskDelete: () => {
    try {
      triggerHaptic('warning');
    } catch (error) {
      console.log('[Haptic] taskDelete failed:', error);
    }
  },
  
  // Navigation & UI
  tabChange: () => {
    try {
      // Güvenli tab change feedback
      if (Platform.OS === 'android') {
        Vibration.vibrate(50);
      } else if (Platform.OS === 'ios') {
        Vibration.vibrate(50);
      }
    } catch (error) {
      console.log('[Haptic] tabChange failed:', error);
    }
  },
  segmentChange: () => {
    try {
      triggerHaptic('selection');
    } catch (error) {
      console.log('[Haptic] segmentChange failed:', error);
    }
  },
  sheetOpen: () => {
    try {
      // Güvenli sheet open feedback
      if (Platform.OS === 'android') {
        Vibration.vibrate(25);
      } else if (Platform.OS === 'ios') {
        Vibration.vibrate(25);
      }
    } catch (error) {
      console.log('[Haptic] sheetOpen failed:', error);
    }
  },
  sheetClose: () => {
    try {
      triggerHaptic('soft');
    } catch (error) {
      console.log('[Haptic] sheetClose failed:', error);
    }
  },
  
  // Gestures
  swipeThreshold: () => {
    try {
      triggerHaptic('rigid');
    } catch (error) {
      console.log('[Haptic] swipeThreshold failed:', error);
    }
  },
  pullRefresh: () => {
    try {
      triggerHaptic('medium');
    } catch (error) {
      console.log('[Haptic] pullRefresh failed:', error);
    }
  },
  
  // Feedback
  success: () => {
    try {
      triggerHaptic('success');
    } catch (error) {
      console.log('[Haptic] success failed:', error);
    }
  },
  warning: () => {
    try {
      triggerHaptic('warning');
    } catch (error) {
      console.log('[Haptic] warning failed:', error);
    }
  },
  error: () => {
    try {
      triggerHaptic('error');
    } catch (error) {
      console.log('[Haptic] error failed:', error);
    }
  },
  
  // Subtle interactions
  checkboxToggle: () => {
    try {
      triggerHaptic('light');
    } catch (error) {
      console.log('[Haptic] checkboxToggle failed:', error);
    }
  },
  labelSelect: () => {
    try {
      triggerHaptic('soft');
    } catch (error) {
      console.log('[Haptic] labelSelect failed:', error);
    }
  },
};
