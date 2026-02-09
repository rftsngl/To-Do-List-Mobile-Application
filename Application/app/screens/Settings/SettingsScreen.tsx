/**
 * SettingsScreen - Ayarlar ekranı
 * Tema toggle, "Show Done in All" toggle, geliştirici araçları
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Database (dev tools için)
import { resetAndSeed, smokeTest } from '../../../src/database';

// Navigation
import { Navigation } from '../../navigation/Stack';
import { setGlobalActiveTab } from '../../navigation/Tabs';

// Theme
import { lightTheme } from '../../theme/theme';

// App Info
const packageInfo = require('../../../package.json');

interface SettingsScreenProps {
  isDarkMode: boolean;
  onThemeToggle: (isDark: boolean) => void;
  showDoneInAll: boolean;
  onShowDoneInAllToggle: (show: boolean) => void;
  onDBCheckPress?: () => void; // __DEV__ modunda DBCheck ekranına geçiş
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  isDarkMode,
  onThemeToggle,
  showDoneInAll,
  onShowDoneInAllToggle,
  onDBCheckPress,
}) => {
  const safeAreaInsets = useSafeAreaInsets();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  // Reset & Seed
  const handleResetSeed = () => {
    Alert.alert(
      'Veritabanını Sıfırla',
      'Bu işlem tüm mevcut verileri siler ve test verisini yeniden oluşturur. Emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sıfırla',
          style: 'destructive',
          onPress: async () => {
            setLoading(prev => ({ ...prev, reset: true }));
            
            try {
              console.log('[Settings] Reset & Seed başlatılıyor...');
              await resetAndSeed();
              console.log('[Settings] ✅ Reset & Seed başarılı');
              
              Alert.alert(
                'Başarılı',
                'Veritabanı sıfırlandı ve test verisi oluşturuldu. Görevler ekranına geçerek yeni verileri görebilirsiniz.'
              );
            } catch (error) {
              console.error('[Settings] ❌ Reset hatası:', error);
              Alert.alert(
                'Hata',
                `Reset işlemi başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
              );
            } finally {
              setLoading(prev => ({ ...prev, reset: false }));
            }
          }
        }
      ]
    );
  };

  // Smoke Test
  const handleSmokeTest = async () => {
    setLoading(prev => ({ ...prev, smoke: true }));
    
    try {
      console.log('[Settings] Smoke test başlatılıyor...');
      await smokeTest();
      console.log('[Settings] ✅ Smoke test başarılı');
      
      Alert.alert(
        'Test Başarılı',
        'Tüm veritabanı testleri başarıyla geçti. Detayları Metro konsol loglarında görebilirsiniz.'
      );
    } catch (error) {
      console.error('[Settings] ❌ Smoke test hatası:', error);
      Alert.alert(
        'Test Başarısız',
        `Smoke test başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
      );
    } finally {
      setLoading(prev => ({ ...prev, smoke: false }));
    }
  };

  // Manage Lists
  const handleManageLists = () => {
    setGlobalActiveTab('Settings'); // Current tab'ı kaydet
    Navigation.push({ name: 'ManageLists' });
  };

  // Manage Labels  
  const handleManageLabels = () => {
    setGlobalActiveTab('Settings'); // Current tab'ı kaydet
    Navigation.push({ name: 'ManageLabels' });
  };

  const renderSettingItem = (
    title: string,
    subtitle?: string,
    rightComponent?: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && (
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        )}
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[
      styles.container,
      { paddingTop: safeAreaInsets.top }
    ]}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Başlık */}
        <Text style={styles.screenTitle}>Ayarlar</Text>

        {/* Görünüm Ayarları */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎨 Görünüm</Text>
          
          {renderSettingItem(
            'Karanlık Mod',
            'Uygulamanın koyu temasını aktif eder',
            <Switch
              value={isDarkMode}
              onValueChange={onThemeToggle}
              trackColor={{
                false: lightTheme.colors.borderSecondary,
                true: lightTheme.colors.primary + '40'
              }}
              thumbColor={isDarkMode ? lightTheme.colors.primary : lightTheme.colors.surface}
            />
          )}
        </View>

        {/* Görev Ayarları */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>✓ Görevler</Text>
          
          {renderSettingItem(
            'Listeler',
            'Görev listelerini yönet (oluştur, düzenle, sil)',
            <Text style={styles.chevron}>›</Text>,
            handleManageLists
          )}

          {renderSettingItem(
            'Etiketler',
            'Görev etiketlerini yönet (oluştur, düzenle, sil)',
            <Text style={styles.chevron}>›</Text>,
            handleManageLabels
          )}
          
          {renderSettingItem(
            'Tamamlanmışları "Tümü"nde Göster',
            'Tamamlanan görevleri ana listede gösterir',
            <Switch
              value={showDoneInAll}
              onValueChange={onShowDoneInAllToggle}
              trackColor={{
                false: lightTheme.colors.borderSecondary,
                true: lightTheme.colors.primary + '40'
              }}
              thumbColor={showDoneInAll ? lightTheme.colors.primary : lightTheme.colors.surface}
            />
          )}
        </View>

        {/* Uygulama Bilgileri */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📱 Uygulama</Text>
          
          {renderSettingItem(
            'TaskFlow',
            `Sürüm ${packageInfo.version}`,
            <Text style={styles.versionBadge}>v{packageInfo.version}</Text>
          )}

          {renderSettingItem(
            'Açıklama',
            packageInfo.description || 'Modern görev yönetimi uygulaması'
          )}

          {renderSettingItem(
            'Geliştirici',
            packageInfo.author || 'TaskFlow Team'
          )}

          {renderSettingItem(
            'Teknoloji',
            'React Native + SQLite + TypeScript'
          )}
        </View>

        {/* Geliştirici Araçları (sadece __DEV__) */}
        {__DEV__ && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🛠 Geliştirici Araçları</Text>
            
            {onDBCheckPress && renderSettingItem(
              'DB Check',
              'Veritabanı test ve debug ekranına git',
              <Text style={styles.chevron}>›</Text>,
              onDBCheckPress
            )}

            {renderSettingItem(
              'Smoke Test Çalıştır',
              loading.smoke ? 'Test çalışıyor...' : 'Tüm veritabanı fonksiyonlarını test et',
              loading.smoke ? (
                <Text style={styles.loadingText}>⏳</Text>
              ) : (
                <Text style={styles.chevron}>▶</Text>
              ),
              loading.smoke ? undefined : handleSmokeTest
            )}

            {renderSettingItem(
              'Reset & Seed',
              loading.reset 
                ? 'Sıfırlama devam ediyor...' 
                : 'Veritabanını sıfırla ve test verisiyle doldur',
              loading.reset ? (
                <Text style={styles.loadingText}>⏳</Text>
              ) : (
                <Text style={styles.dangerChevron}>🗑</Text>
              ),
              loading.reset ? undefined : handleResetSeed
            )}

            <View style={styles.devNote}>
              <Text style={styles.devNoteText}>
                ℹ️ Bu bölüm yalnızca geliştirme modunda görünür.
                Detaylı logları Metro konsol'dan takip edebilirsiniz.
              </Text>
            </View>
          </View>
        )}

        {/* Alt boşluk */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

// Stilleri
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.backgroundSecondary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: lightTheme.spacing.xxl,
  },
  screenTitle: {
    ...lightTheme.typography.h2,
    color: lightTheme.colors.text,
    marginHorizontal: lightTheme.spacing.md,
    marginVertical: lightTheme.spacing.lg,
  },
  section: {
    marginBottom: lightTheme.spacing.lg,
  },
  card: {
    backgroundColor: lightTheme.colors.surface,
    borderRadius: lightTheme.ui.borderRadius.lg,
    marginHorizontal: lightTheme.spacing.md,
    marginBottom: lightTheme.spacing.md,
    overflow: 'hidden',
    ...lightTheme.ui.shadow.sm,
  },
  cardTitle: {
    ...lightTheme.typography.h4,
    color: lightTheme.colors.text,
    paddingHorizontal: lightTheme.spacing.md,
    paddingTop: lightTheme.spacing.md,
    paddingBottom: lightTheme.spacing.sm,
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    ...lightTheme.typography.h4,
    color: lightTheme.colors.textSecondary,
    marginHorizontal: lightTheme.spacing.md,
    marginBottom: lightTheme.spacing.sm,
    textTransform: 'uppercase',
    fontSize: 13,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: lightTheme.spacing.md,
    paddingHorizontal: lightTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.border + '40',
    minHeight: 60,
  },
  settingContent: {
    flex: 1,
    marginRight: lightTheme.spacing.sm,
  },
  settingTitle: {
    ...lightTheme.typography.body,
    color: lightTheme.colors.text,
    fontWeight: '500',
  },
  settingSubtitle: {
    ...lightTheme.typography.bodySmall,
    color: lightTheme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  settingRight: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  chevron: {
    fontSize: 18,
    color: lightTheme.colors.textTertiary,
    fontWeight: '600',
  },
  dangerChevron: {
    fontSize: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  versionBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: lightTheme.colors.primary,
    backgroundColor: lightTheme.colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: lightTheme.ui.borderRadius.full,
    textAlign: 'center',
    minWidth: 40,
  },
  devNote: {
    backgroundColor: lightTheme.colors.accent + '10',
    borderWidth: 1,
    borderColor: lightTheme.colors.accent + '30',
    borderRadius: lightTheme.ui.borderRadius.md,
    padding: lightTheme.spacing.md,
    marginHorizontal: lightTheme.spacing.md,
    marginTop: lightTheme.spacing.md,
  },
  devNoteText: {
    ...lightTheme.typography.bodySmall,
    color: lightTheme.colors.text,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: lightTheme.spacing.xxl,
  },
});
