/**
 * Basit Stack Navigator - Harici kütüphane kullanmadan
 * Android BackHandler desteği ile push/pop işlemleri
 */

import React, { useState, useEffect, ReactNode, createContext, useContext } from 'react';
import { BackHandler, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Route tipi
export interface Route {
  name: string;
  params?: Record<string, any>;
}

// Stack context tipi
interface StackContextType {
  stack: Route[];
  push: (route: Route) => void;
  pop: () => void;
  canGoBack: () => boolean;
  getCurrentRoute: () => Route | null;
}

// Stack context
const StackContext = createContext<StackContextType | null>(null);

// Stack hook
export function useStack(): StackContextType {
  const context = useContext(StackContext);
  if (!context) {
    throw new Error('useStack must be used within a StackNavigator');
  }
  return context;
}

// Stack Navigator bileşeni
interface StackNavigatorProps {
  initialRoute: Route;
  children: ReactNode;
}

export const StackNavigator: React.FC<StackNavigatorProps> = ({
  initialRoute,
  children,
}) => {
  const [stack, setStack] = useState<Route[]>([initialRoute]);

  // Android back button handler
  useEffect(() => {
    const backAction = () => {
      if (stack.length > 1) {
        // Stack'te birden fazla route varsa pop yap
        pop();
        return true; // Event'i consume et
      }
      // Stack'te sadece bir route varsa, default davranışı bırak (uygulamayı kapat)
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [stack.length]);

  const push = (route: Route) => {
    setStack(prevStack => [...prevStack, route]);
  };

  const pop = () => {
    setStack(prevStack => {
      if (prevStack.length > 1) {
        return prevStack.slice(0, -1);
      }
      return prevStack;
    });
  };

  const canGoBack = () => {
    return stack.length > 1;
  };

  const getCurrentRoute = () => {
    return stack[stack.length - 1] || null;
  };

  const stackValue: StackContextType = {
    stack,
    push,
    pop,
    canGoBack,
    getCurrentRoute,
  };

  return (
    <StackContext.Provider value={stackValue}>
      {children}
    </StackContext.Provider>
  );
};

// Screen bileşeni - Stack içindeki screen'leri render etmek için
interface ScreenProps {
  name: string;
  children: (props: { route: Route }) => ReactNode;
}

export const Screen: React.FC<ScreenProps> = ({ name, children }) => {
  const { getCurrentRoute } = useStack();
  const currentRoute = getCurrentRoute();
  
  if (!currentRoute || currentRoute.name !== name) {
    return null;
  }

  return <>{children({ route: currentRoute })}</>;
};

// Navigation helper - screen dışından da push/pop yapmak için
let globalStackRef: StackContextType | null = null;

export const StackGlobalRef: React.FC<{ children: ReactNode }> = ({ children }) => {
  const stack = useStack();
  
  useEffect(() => {
    globalStackRef = stack;
    return () => {
      globalStackRef = null;
    };
  }, [stack]);

  return <>{children}</>;
};

// Global navigation functions
export const Navigation = {
  push: (route: Route) => {
    if (globalStackRef) {
      globalStackRef.push(route);
    } else {
      console.warn('Stack not initialized. Make sure to wrap your app with StackNavigator.');
    }
  },
  
  pop: () => {
    if (globalStackRef) {
      globalStackRef.pop();
    } else {
      console.warn('Stack not initialized. Make sure to wrap your app with StackNavigator.');
    }
  },
  
  canGoBack: (): boolean => {
    return globalStackRef?.canGoBack() ?? false;
  },
  
  getCurrentRoute: (): Route | null => {
    return globalStackRef?.getCurrentRoute() ?? null;
  },
};

// Header bileşeni - Geri butonu ile
interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  rightComponent,
}) => {
  const { pop, canGoBack } = useStack();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      pop();
    }
  };

  return (
    <View style={headerStyles.container}>
      {/* Sol taraf - Geri butonu */}
      <View style={headerStyles.leftSection}>
        {showBackButton && canGoBack() && (
          <TouchableOpacity
            onPress={handleBackPress}
            style={headerStyles.backButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={headerStyles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Orta - Başlık */}
      <View style={headerStyles.titleSection}>
        <Text style={headerStyles.title}>{title}</Text>
      </View>

      {/* Sağ taraf */}
      <View style={headerStyles.rightSection}>
        {rightComponent}
      </View>
    </View>
  );
};

// Header stilleri
const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    minHeight: 56,
  },
  leftSection: {
    minWidth: 48,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 12,
    borderRadius: 8,
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#3B82F6',
    fontWeight: '600',
  },
  titleSection: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  rightSection: {
    minWidth: 48,
    alignItems: 'flex-end',
  },
});
