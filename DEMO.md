# 🚀 TodoMobile Demo Rehberi

Bu rehber, oluşturulan SQLite veri katmanı ve başlangıç kapısının nasıl çalıştığını gösterir.

## 📱 Uygulamayı Çalıştırma

### Android
```bash
npm run android
```

### iOS  
```bash
npm run ios
```

## 🔧 Uygulama Başlangıç Süreci

### 1. InitGate Süreci
Uygulama açıldığında şu adımlar gerçekleşir:

```
1. "Hazırlanıyor..." ekranı görünür
2. DatabaseManager.init() çağrılır
3. Migration'lar otomatik çalışır (v1 şema oluşturulur)
4. __DEV__ modunda:
   - Eğer veri yoksa seedDatabase() çağrılır
   - 2 liste, 12+ görev, 3 etiket, alt görevler oluşturulur
5. Başarı durumunda ana uygulama yüklenir
6. Hata durumunda "Tekrar Dene" butonu gösterilir
```

### 2. Konsol Logları
Metro konsolunda şu logları görmelisiniz:

```
[InitGate] Uygulama başlatılıyor...
[InitGate] Veritabanı başlatılıyor...
[Migration] v1 çalıştırılıyor: initial_schema
[InitGate] ✅ Veritabanı başarıyla başlatıldı
[InitGate] Geliştirme modu - seed kontrolü yapılıyor...
[Seed] Veritabanını test verisi oluşturuluyor...
[Seed] 2 liste oluşturuldu
[Seed] 3 etiket oluşturuldu
[Seed] 12 görev oluşturuldu
[InitGate] ✅ Test verisi başarıyla oluşturuldu
[InitGate] 🎉 Uygulama hazır!
```

## 🛠 DBCheckScreen Özellikleri

Uygulama açıldıktan sonra test ekranında şu özellikler bulunur:

### 📊 Veritabanı İstatistikleri
- **Listeler**: Toplam liste sayısı
- **Görevler**: Toplam görev sayısı  
- **Etiketler**: Toplam etiket sayısı
- **Alt Görevler**: Toplam alt görev sayısı
- **DB Boyutu**: SQLite dosya boyutu (KB)
- **Schema V**: Migration sürümü

### 🧪 Test İşlemleri

#### 🔍 Smoke Test Çalıştır
- Tüm repository fonksiyonlarını test eder
- Örnek veri örneklerini gösterir:
  - İlk liste ve görev adı
  - Vadesi geçmiş görev sayısı
  - Bu hafta vadesi dolan görev sayısı
- Başarı/hata durumunu raporlar

#### 🗑 Temizle ve Seed Et
- **UYARI**: Tüm mevcut verileri siler!
- Veritabanını sıfırlar
- Test verisini yeniden oluşturur
- Onay iletişim kutusu gösterir

## 🔍 Test Senaryoları

### Manuel Test Adımları

1. **İlk Açılış Testi**
   - Uygulamayı açın
   - "Hazırlanıyor..." ekranının göründüğünü kontrol edin
   - Test ekranının yüklendiğini kontrol edin
   - İstatistiklerde veri olduğunu kontrol edin

2. **Smoke Test**
   - "Smoke Test Çalıştır" butonuna basın
   - "Çalışıyor..." durumunu izleyin
   - Başarı sonucunu ve örnek verileri kontrol edin
   - Metro loglarında detayları kontrol edin

3. **Reset Test**
   - "Temizle ve Seed Et" butonuna basın
   - Onay iletişim kutusuna "Sıfırla" deyin
   - İşlem tamamlandıktan sonra istatistiklerin güncellendiğini kontrol edin

4. **Hata Simülasyonu** (Geliştirme)
   - Cihazda SQLite desteği olmadığını simüle edin
   - InitGate'in hata ekranını gösterip göstermediğini kontrol edin
   - "Tekrar Dene" butonunun çalıştığını kontrol edin

## 📱 Gerçek Cihaz Testi

### Android
```bash
# Gerçek cihaza deploy
npx react-native run-android --device

# Release build testi
npx react-native run-android --variant=release
```

### iOS
```bash
# Simulator
npx react-native run-ios

# Gerçek cihaz
npx react-native run-ios --device "Device Name"
```

## 🐛 Olası Sorunlar ve Çözümleri

### 1. "react-native-quick-sqlite not found"
```bash
# Package yeniden yükle
npm install

# iOS için pods yenile
cd ios && pod install && cd ..

# Cache temizle
npx react-native start --reset-cache
```

### 2. "Database initialization failed"
- Cihaz depolama alanını kontrol edin
- Uygulamayı tamamen kapatıp açın
- Metro loglarından detaylı hata mesajını kontrol edin

### 3. "Seed data creation failed"  
- Uygulamayı yeniden başlatın (seed atlanacak)
- "Temizle ve Seed Et" ile manuel reset yapın
- Veritabanı dosya izinlerini kontrol edin

### 4. Performans Sorunları
- Release build kullanın (`--variant=release`)
- Metro bundler'ı yeniden başlatın
- Cihaz depolama alanını kontrol edin

## 📊 Beklenen Test Verileri

Başarılı seed sonrası şu verileri görmelisiniz:

```
📊 Veritabanı İstatistikleri:
- Listeler: 2 (Kişisel, İş)
- Görevler: 12 (farklı status ve priority'ler)
- Etiketler: 3 (Acil, Önemli, Toplantı)
- Alt Görevler: 15+ (bazı görevlerde)
- DB Boyutu: ~50-100KB
- Schema V: 1

🔍 Smoke Test Sonuçları:
- İlk Liste: "Kişisel" veya "İş"
- İlk Görev: "Market alışverişi yap" vb.
- Vadesi Geçmiş: 2-3 görev
- Bu Hafta: 3-5 görev
```

## 🚀 Sonraki Adımlar

Bu temel yapı hazır olduktan sonra:

1. **Navigation Sistemi**: React Navigation entegrasyonu
2. **UI Components**: Liste, görev, etiket component'ları
3. **State Management**: Context API veya Redux
4. **Offline Support**: Ağ bağlantısı kontrolü
5. **Sync System**: Gelecekte server entegrasyonu

## 📝 Geliştirici Notları

- **__DEV__ Blokları**: Üretimde otomatik olarak devre dışı kalır
- **Console Logs**: Metro konsolundan izlenebilir
- **SQLite Dosya**: `Android: /data/data/com.todomobile/databases/todoapp.db`
- **Error Boundaries**: InitGate seviyesinde hata yakalama var
- **Transaction Safety**: Tüm veritabanı işlemleri ACID uyumlu
