/**
 * DBCheckScreen - Geliştirme veritabanı test ekranı
 * Smoke test, reset/seed ve veri kontrolü işlemleri
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  DatabaseManager,
  smokeTest,
  resetAndSeed,
  ListsRepository,
  TasksRepository,
  LabelsRepository,
  SubtasksRepository,
} from '@database';

interface DatabaseStats {
  lists: number;
  tasks: number;
  labels: number;
  subtasks: number;
  dbSize: string;
  version: number;
}

interface SmokeTestResult {
  success: boolean;
  stats: DatabaseStats;
  sampleData?: {
    firstList?: string;
    firstTask?: string;
    overdueTasks: number;
    thisWeekTasks: number;
  };
  error?: string;
}

export const DBCheckScreen: React.FC = () => {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [smokeResult, setSmokeResult] = useState<SmokeTestResult | null>(null);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

  // Geliştirme modu kontrolü
  if (!__DEV__) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Bu ekran yalnızca geliştirme modunda kullanılabilir.
        </Text>
      </View>
    );
  }

  // Veritabanı istatistiklerini yükle
  const loadStats = async () => {
    try {
      const dbStats = await DatabaseManager.getStats();
      const newStats: DatabaseStats = {
        lists: await ListsRepository.count(),
        tasks: await TasksRepository.count(),
        labels: await LabelsRepository.count(),
        subtasks: await SubtasksRepository.count(),
        dbSize: `${Math.round(dbStats.dbSize / 1024)}KB`,
        version: dbStats.version,
      };
      setStats(newStats);
    } catch (error) {
      console.error('[DBCheck] İstatistik yükleme hatası:', error);
    }
  };

  // İlk yükleme
  useEffect(() => {
    loadStats();
  }, []);

  // Smoke test çalıştır
  const runSmokeTest = async () => {
    setIsLoading(prev => ({ ...prev, smoke: true }));
    setSmokeResult(null);

    try {
      console.log('[DBCheck] Smoke test başlatılıyor...');
      
      // Smoke test'i çalıştır
      await smokeTest();

      // Test sonrası örnek veri topla
      const lists = await ListsRepository.getAll();
      const tasks = await TasksRepository.count();
      const overdueTasks = await TasksRepository.getOverdue();
      const thisWeekTasks = await TasksRepository.getThisWeek();

      const sampleData = {
        firstList: lists.length > 0 ? lists[0].name : undefined,
        firstTask: lists.length > 0 
          ? (await TasksRepository.getByList(lists[0].id))[0]?.title 
          : undefined,
        overdueTasks: overdueTasks.length,
        thisWeekTasks: thisWeekTasks.length,
      };

      // Güncel istatistikleri al
      await loadStats();

      setSmokeResult({
        success: true,
        stats: stats!,
        sampleData,
      });

      console.log('[DBCheck] ✅ Smoke test başarılı');

    } catch (error) {
      console.error('[DBCheck] ❌ Smoke test hatası:', error);
      setSmokeResult({
        success: false,
        stats: stats!,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, smoke: false }));
    }
  };

  // Veritabanını temizle ve seed et
  const resetAndSeedDatabase = async () => {
    Alert.alert(
      'Veritabanını Sıfırla',
      'Bu işlem tüm mevcut verileri siler ve test verisini yeniden oluşturur. Emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sıfırla',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(prev => ({ ...prev, reset: true }));
            setSmokeResult(null);

            try {
              console.log('[DBCheck] Reset ve seed başlatılıyor...');
              await resetAndSeed();
              await loadStats();
              console.log('[DBCheck] ✅ Reset ve seed başarılı');

              Alert.alert('Başarılı', 'Veritabanı sıfırlandı ve test verisi oluşturuldu.');

            } catch (error) {
              console.error('[DBCheck] ❌ Reset hatası:', error);
              Alert.alert(
                'Hata',
                `Reset işlemi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
              );
            } finally {
              setIsLoading(prev => ({ ...prev, reset: false }));
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>🛠 Veritabanı Test Merkezi</Text>
      <Text style={styles.subtitle}>Geliştirme Araçları</Text>

      {/* Veritabanı İstatistikleri */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Veritabanı İstatistikleri</Text>
        {stats ? (
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Listeler:</Text>
              <Text style={styles.statValue}>{stats.lists}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Görevler:</Text>
              <Text style={styles.statValue}>{stats.tasks}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Etiketler:</Text>
              <Text style={styles.statValue}>{stats.labels}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Alt Görevler:</Text>
              <Text style={styles.statValue}>{stats.subtasks}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>DB Boyutu:</Text>
              <Text style={styles.statValue}>{stats.dbSize}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Schema V:</Text>
              <Text style={styles.statValue}>{stats.version}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        )}
      </View>

      {/* Test Butonları */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧪 Test İşlemleri</Text>
        
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={runSmokeTest}
          disabled={isLoading.smoke}
        >
          {isLoading.smoke ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>🔍 Smoke Test Çalıştır</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={resetAndSeedDatabase}
          disabled={isLoading.reset}
        >
          {isLoading.reset ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>🗑 Temizle ve Seed Et</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Smoke Test Sonuçları */}
      {smokeResult && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {smokeResult.success ? '✅ Test Sonuçları' : '❌ Test Hatası'}
          </Text>
          
          {smokeResult.success ? (
            <View style={styles.resultContainer}>
              <Text style={styles.successText}>Tüm testler başarılı!</Text>
              
              {smokeResult.sampleData && (
                <View style={styles.sampleData}>
                  <Text style={styles.sampleTitle}>Örnek Veriler:</Text>
                  
                  {smokeResult.sampleData.firstList && (
                    <Text style={styles.sampleItem}>
                      • İlk Liste: "{smokeResult.sampleData.firstList}"
                    </Text>
                  )}
                  
                  {smokeResult.sampleData.firstTask && (
                    <Text style={styles.sampleItem}>
                      • İlk Görev: "{smokeResult.sampleData.firstTask}"
                    </Text>
                  )}
                  
                  <Text style={styles.sampleItem}>
                    • Vadesi Geçmiş: {smokeResult.sampleData.overdueTasks} görev
                  </Text>
                  
                  <Text style={styles.sampleItem}>
                    • Bu Hafta: {smokeResult.sampleData.thisWeekTasks} görev
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {smokeResult.error || 'Bilinmeyen test hatası'}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Bilgi Notu */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>ℹ️ Bilgi</Text>
        <Text style={styles.infoText}>
          • Bu ekran yalnızca geliştirme modunda görünür{'\n'}
          • Smoke test tüm repository fonksiyonlarını kontrol eder{'\n'}
          • Reset işlemi tüm verileri siler ve test verisini yeniden oluşturur{'\n'}
          • Detaylı logları Metro konsolundan takip edin
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  statsContainer: {
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#4B5563',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  loadingText: {
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 48,
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
  },
  dangerButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  successText: {
    color: '#065F46',
    fontWeight: '600',
    marginBottom: 8,
  },
  sampleData: {
    marginTop: 8,
  },
  sampleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 4,
  },
  sampleItem: {
    fontSize: 13,
    color: '#047857',
    marginBottom: 2,
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#991B1B',
    fontSize: 14,
  },
  infoSection: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
});
