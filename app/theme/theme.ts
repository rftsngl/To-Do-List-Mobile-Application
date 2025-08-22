/**
 * Tema sistemi - Renk paleti, tipografi, spacing
 * NOT: Dokunma hedefleri minimum 48×48dp olmalı (Android Material Design)
 */

export type ThemeMode = 'light' | 'dark';

// 8pt spacing sistemi
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Renk paleti
export const colors = {
  light: {
    // Ana renkler
    primary: '#3B82F6',      // Blue-500
    primaryDark: '#2563EB',  // Blue-600 (pressed)
    secondary: '#10B981',    // Green-500
    accent: '#F59E0B',       // Yellow-500
    error: '#EF4444',        // Red-500
    success: '#10B981',      // Green-500
    warning: '#F59E0B',      // Yellow-500
    
    // Arka plan
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',  // Gray-50
    surface: '#FFFFFF',
    surfaceSecondary: '#F3F4F6',     // Gray-100
    
    // Metin
    text: '#111827',         // Gray-900
    textSecondary: '#6B7280', // Gray-500
    textTertiary: '#9CA3AF', // Gray-400
    textDisabled: '#D1D5DB', // Gray-300
    
    // Kenarlıklar
    border: '#E5E7EB',       // Gray-200
    borderSecondary: '#D1D5DB', // Gray-300
    
    // Özel durumlar
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.1)',
    
    // Task durumları
    todo: '#3B82F6',         // Blue
    inProgress: '#F59E0B',   // Orange
    blocked: '#EF4444',      // Red
    done: '#10B981',         // Green
    
    // Priority renkler
    priorityLow: '#9CA3AF',      // Gray-400
    priorityNormal: '#3B82F6',   // Blue-500
    priorityHigh: '#F59E0B',     // Yellow-500
    priorityCritical: '#EF4444', // Red-500
  },
  
  dark: {
    // Ana renkler
    primary: '#60A5FA',      // Blue-400
    primaryDark: '#3B82F6',  // Blue-500 (pressed)
    secondary: '#34D399',    // Green-400
    accent: '#FBBF24',       // Yellow-400
    error: '#F87171',        // Red-400
    success: '#34D399',      // Green-400
    warning: '#FBBF24',      // Yellow-400
    
    // Arka plan
    background: '#111827',    // Gray-900
    backgroundSecondary: '#1F2937', // Gray-800
    surface: '#1F2937',      // Gray-800
    surfaceSecondary: '#374151', // Gray-700
    
    // Metin
    text: '#F9FAFB',         // Gray-50
    textSecondary: '#D1D5DB', // Gray-300
    textTertiary: '#9CA3AF', // Gray-400
    textDisabled: '#6B7280', // Gray-500
    
    // Kenarlıklar
    border: '#374151',       // Gray-700
    borderSecondary: '#4B5563', // Gray-600
    
    // Özel durumlar
    overlay: 'rgba(0, 0, 0, 0.7)',
    shadow: 'rgba(0, 0, 0, 0.3)',
    
    // Task durumları
    todo: '#60A5FA',         // Blue-400
    inProgress: '#FBBF24',   // Yellow-400
    blocked: '#F87171',      // Red-400
    done: '#34D399',         // Green-400
    
    // Priority renkler
    priorityLow: '#9CA3AF',      // Gray-400
    priorityNormal: '#60A5FA',   // Blue-400
    priorityHigh: '#FBBF24',     // Yellow-400
    priorityCritical: '#F87171', // Red-400
  },
} as const;

// Tipografi
export const typography = {
  // Başlıklar
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  
  // Gövde metni
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20,
  },
  
  // Etiketler
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
  
  // Butonlar
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
} as const;

// UI sabitler
export const ui = {
  // Minimum dokunma hedefi (Material Design)
  minTouchTarget: 48,
  
  // Kenarlık yuvarlaklık
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  
  // Gölgeler
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
  },
  
  // Z-index katmanları
  zIndex: {
    fab: 10,
    modal: 20,
    overlay: 30,
    sheet: 40,
    tooltip: 50,
  },
} as const;

// Tema oluşturucu
export function createTheme(mode: ThemeMode) {
  return {
    mode,
    colors: colors[mode],
    spacing,
    typography,
    ui,
  };
}

// Varsayılan light tema
export const lightTheme = createTheme('light');
export const darkTheme = createTheme('dark');

export type Theme = ReturnType<typeof createTheme>;

// Priority renk helper
export function getPriorityColor(priority: number, theme: Theme): string {
  switch (priority) {
    case 0: return theme.colors.priorityLow;
    case 1: return theme.colors.priorityNormal;
    case 2: return theme.colors.priorityHigh;
    case 3: return theme.colors.priorityCritical;
    default: return theme.colors.priorityNormal;
  }
}

// Status renk helper  
export function getStatusColor(status: string, theme: Theme): string {
  switch (status) {
    case 'todo': return theme.colors.todo;
    case 'in_progress': return theme.colors.inProgress;
    case 'blocked': return theme.colors.blocked;
    case 'done': return theme.colors.done;
    default: return theme.colors.todo;
  }
}
