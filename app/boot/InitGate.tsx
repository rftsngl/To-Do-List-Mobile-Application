/**
 * InitGate - Uygulama başlangıç kapısı
 * Veritabanını başlatır, geliştirme modunda seed eder
 */

import React, { useEffect, useState, ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { DatabaseManager, seedDatabase, ListsRepository } from '../../src/database';

interface InitGateProps {
  children: ReactNode;
}

type InitState = 'loading' | 'success' | 'error';

export const InitGate: React.FC<InitGateProps> = ({ children }) => {
  const [initState, setInitState] = useState<InitState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const initializeApp = async () => {
    try {
      console.log('[InitGate] Uygulama başlatılıyor...');
      setInitState('loading');
      setError(null);

      // 1. Veritabanını başlat
      console.log('[InitGate] Veritabanı başlatılıyor...');
      await DatabaseManager.init();
      console.log('[InitGate] ✅ Veritabanı başarıyla başlatıldı');

      // 2. Geliştirme modunda seed kontrolü
      if (__DEV__) {
        console.log('[InitGate] Geliştirme modu - seed kontrolü yapılıyor...');
        
        try {
          // Mevcut liste sayısını kontrol et
          const existingLists = await ListsRepository.getAll();
          
          if (existingLists.length === 0) {
            console.log('[InitGate] Veri yok, seed başlatılıyor...');
            await seedDatabase();
            console.log('[InitGate] ✅ Test verisi başarıyla oluşturuldu');
          } else {
            console.log(`[InitGate] Mevcut veri bulundu (${existingLists.length} liste)`);
          }
        } catch (seedError) {
          // Seed hatası uygulama başlangıcını engellemez
          console.warn('[InitGate] ⚠️ Seed hatası (devam edildi):', seedError);
        }
      }

      console.log('[InitGate] 🎉 Uygulama hazır!');
      setInitState('success');

    } catch (initError) {
      console.error('[InitGate] ❌ Başlatma hatası:', initError);
      setError(
        initError instanceof Error 
          ? initError.message 
          : 'Bilinmeyen bir hata oluştu'
      );
      setInitState('error');
    } finally {
      setIsRetrying(false);
    }
  };

  // İlk başlatma
  useEffect(() => {
    initializeApp();
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    initializeApp();
  };

  const handleShowDetails = () => {
    Alert.alert(
      'Hata Detayları',
      error || 'Bilinmeyen hata',
      [{ text: 'Tamam' }]
    );
  };

  // Yükleme durumu
  if (initState === 'loading') {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>
            {isRetrying ? 'Tekrar deneniyor...' : 'Hazırlanıyor...'}
          </Text>
          <Text style={styles.subText}>
            Veritabanı başlatılıyor
          </Text>
        </View>
      </View>
    );
  }

  // Hata durumu
  if (initState === 'error') {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Başlatma Hatası</Text>
          <Text style={styles.errorMessage}>
            Uygulama başlatılırken bir sorun oluştu.
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={handleRetry}
              disabled={isRetrying}
            >
              <Text style={styles.retryButtonText}>
                {isRetrying ? 'Deneniyor...' : 'Tekrar Dene'}
              </Text>
            </TouchableOpacity>

            {error && (
              <TouchableOpacity 
                style={styles.detailsButton}
                onPress={handleShowDetails}
              >
                <Text style={styles.detailsButtonText}>
                  Hata Detayları
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {__DEV__ && (
            <View style={styles.devInfo}>
              <Text style={styles.devInfoText}>
                Geliştirme Modu - Metro loglarını kontrol edin
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  // Başarı - children'ı render et
  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  detailsButtonText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '500',
  },
  devInfo: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  devInfoText: {
    fontSize: 12,
    color: '#92400E',
    textAlign: 'center',
  },
});
