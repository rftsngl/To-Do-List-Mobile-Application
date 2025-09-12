/**
 * TodoMobile App - SQLite Veritabanı ile Todo Uygulaması
 * React Native + TypeScript + Harici kütüphane yok navigasyon
 *
 * @format
 */

import React, { useState, useCallback } from 'react';
import { StatusBar } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

// Uygulama başlangıç kapısı
import { InitGate } from './app/boot/InitGate';

// Navigasyon
import { StackNavigator, StackGlobalRef, Screen } from './app/navigation/Stack';
import { TabNavigator, TabScreen } from './app/navigation/Tabs';

// Ekranlar
import { TasksScreen } from './app/screens/Tasks/TasksScreen';
import { NewTaskSheet } from './app/screens/Tasks/NewTaskSheet';
import { TaskDetailScreen } from './app/screens/Tasks/TaskDetailScreen';
import { SettingsScreen } from './app/screens/Settings/SettingsScreen';
import { ManageListsScreen } from './app/screens/Settings/ManageListsScreen';
import { ManageLabelsScreen } from './app/screens/Settings/ManageLabelsScreen';
import { DBCheckScreen } from './app/screens/DBCheckScreen';

// Navigation helper
import { Navigation } from './app/navigation/Stack';

// Theme
import { ThemeProvider } from './app/theme/ThemeContext';

// Utils
import { HapticFeedback } from './app/utils/haptics';
import { performanceMonitor } from './app/utils/performance';

function App() {
  return (
    <SafeAreaProvider>
      <InitGate>
        <AppContent />
      </InitGate>
    </SafeAreaProvider>
  );
}

function AppContent() {
  // State yönetimi
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDoneInAll, setShowDoneInAll] = useState(false);
  const [newTaskSheetVisible, setNewTaskSheetVisible] = useState(false);
  const [taskRefreshKey, setTaskRefreshKey] = useState(0);

  // Performance monitoring
  React.useEffect(() => {
    performanceMonitor.start();
    
    // Log summary every 30 seconds in development
    const summaryInterval = __DEV__ ? setInterval(() => {
      performanceMonitor.logSummary();
    }, 30000) : null;

    return () => {
      performanceMonitor.stop();
      if (summaryInterval) {
        clearInterval(summaryInterval);
      }
    };
  }, []);

  // Navigation handlers - useCallback ile stable references
  const handleTaskPress = useCallback((taskId: string) => {
    HapticFeedback.buttonPress(); // Güvenli haptic implement edildi
    console.log('[App] TaskPress with taskId:', taskId);
    if (!taskId) {
      console.error('[App] TaskPress called with undefined taskId');
      return;
    }
    Navigation.push({ name: 'TaskDetail', params: { taskId } });
  }, []);

  const handleTaskMenu = useCallback((_taskId: string) => {
    // Task menüsü artık TasksScreen içinde yönetiliyor
    // Bu fonksiyon artık kullanılmıyor
    // HapticFeedback.buttonPress(); // Geçici devre dışı - crash önleme
  }, []);

  const handleNewTask = useCallback(() => {
    HapticFeedback.sheetOpen(); // Güvenli haptic implement edildi
    console.log('[App] Opening NewTaskSheet');
    setNewTaskSheetVisible(true);
  }, []);

  const handleTaskCreated = useCallback(() => {
    // TasksScreen'i yenile
    setTaskRefreshKey(prev => prev + 1);
  }, []);

  const handleTaskUpdated = useCallback(() => {
    // TasksScreen'i yenile
    setTaskRefreshKey(prev => prev + 1);
  }, []);

  const handleTaskDeleted = useCallback(() => {
    // TasksScreen'i yenile
    setTaskRefreshKey(prev => prev + 1);
  }, []);

  const handleDBCheckPress = () => {
    Navigation.push({ name: 'DBCheck' });
  };

  return (
    <ThemeProvider isDarkMode={isDarkMode} onThemeToggle={setIsDarkMode}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#111827' : '#FFFFFF'}
        translucent={false}
        hidden={false}
        animated={true}
      />
      <StackNavigator initialRoute={{ name: 'Main' }}>
        <StackGlobalRef>
        {/* Ana Tab Ekranı */}
        <Screen name="Main">
          {() => (
            <TabNavigator initialTab="Tasks">
              {/* Tasks Tab */}
              <TabScreen name="Tasks">
                <TasksScreen
                  key={taskRefreshKey}
                  onNewTask={handleNewTask}
                  onTaskPress={handleTaskPress}
                  onTaskMenu={handleTaskMenu}
                  showDoneInAll={showDoneInAll}
                />
              </TabScreen>

              {/* Settings Tab */}
              <TabScreen name="Settings">
                <SettingsScreen
                  isDarkMode={isDarkMode}
                  onThemeToggle={setIsDarkMode}
                  showDoneInAll={showDoneInAll}
                  onShowDoneInAllToggle={setShowDoneInAll}
                  onDBCheckPress={__DEV__ ? handleDBCheckPress : undefined}
                />
              </TabScreen>
            </TabNavigator>
          )}
        </Screen>

        {/* Task Detail Screen */}
        <Screen name="TaskDetail">
          {({ route }) => {
            const taskId = route.params?.taskId;
            console.log('[App] TaskDetail opening with taskId:', taskId);
            
            return (
              <TaskDetailScreen
                taskId={taskId}
                onClose={() => Navigation.pop()}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={handleTaskDeleted}
              />
            );
          }}
        </Screen>

        {/* Manage Lists Screen */}
        <Screen name="ManageLists">
          {() => <ManageListsScreen />}
        </Screen>

        {/* Manage Labels Screen */}
        <Screen name="ManageLabels">
          {() => <ManageLabelsScreen />}
        </Screen>

        {/* DB Check Screen (dev only) */}
        {__DEV__ && (
          <Screen name="DBCheck">
            {() => <DBCheckScreen />}
          </Screen>
        )}

        {/* New Task Sheet */}
        <NewTaskSheet
          isVisible={newTaskSheetVisible}
          onClose={() => setNewTaskSheetVisible(false)}
          onTaskCreated={handleTaskCreated}
        />
      </StackGlobalRef>
    </StackNavigator>
    </ThemeProvider>
  );
}

// Styles kaldırıldı - kullanılmıyor

export default App;
