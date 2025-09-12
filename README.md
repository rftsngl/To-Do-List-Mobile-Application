# TodoMobile - Görev Yönetim Uygulaması

[![React Native](https://img.shields.io/badge/React%20Native-0.81.0-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-react--native--sqlite--storage-green.svg)](https://www.npmjs.com/package/react-native-sqlite-storage)

<details>
<summary><h2>🚀 Genel Bakış</h2></summary>

TodoMobile, React Native ve TypeScript kullanılarak geliştirilmiş, offline çalışabilen modern görev yönetim uygulamasıdır. Clean Architecture prensiplerine uygun olarak tasarlanmış, SQLite ile güçlü yerel veri depolama sağlar. **Son güncellemede major UI/UX yeniden tasarım ve performans optimizasyonları yapılmıştır.**

</details>

<details>
<summary><h2>🎯 Son Güncellemeler (Aralık 2024)</h2></summary>

### ✨ **Major UI/UX Yeniden Tasarım**

- **Modern Card-Based Design**: Tüm ekranlar için tutarlı card tasarımı
- **ThemeContext Sistemi**: Global tema yönetimi eklendi
- **Enhanced Navigation**: Geliştirilmiş navigasyon ve keyboard handling
- **Material Design 3**: Modern tasarım standartları uygulandı

### 🔧 **Yeni Özellikler**

- **Görev Silme**: Task deletion özelliği eklendi
- **Progress Bars**: List completion tracking göstergeleri
- **TaskActionSheet**: Modern görev menü sistemi
- **Subtask Ordering**: Gelişmiş alt görev sıralama sistemi
- **Repository Optimizasyonu**: Kapsamlı .gitignore güncellemeleri

### 🐛 **Bug Fixes**

- Subtask completion banner sorunu çözüldü
- Android status bar transparency issues düzeltildi
- Gradle deprecation warnings giderildi
- Windows path escape sorunları çözüldü

### 📊 **Teknik İyileştirmeler**

- Database Migration v2 implementasyonu
- Android build configuration optimizasyonu  
- Modern WindowCompat API kullanımı
- Enhanced error handling ve user feedback

</details>

<details>
<summary><h2>🌟 Mevcut Özellikler</h2></summary>

### ✅ Halihazırda Çalışan Özellikler

#### Görev Yönetimi

- **Görev CRUD İşlemleri**: Oluşturma, okuma, güncelleme, **silme** (yeni eklendi)
- **Durum Yönetimi**: Todo, İşlemde, Engellendi, Tamamlandı
- **Öncelik Sistemi**: 4 seviyeli öncelik (0-3)
- **Alt Görevler**: Gelişmiş subtask desteği ve **ordering sistemi**
- **TaskActionSheet**: Modern görev menü sistemi ile hızlı işlemler
- **Progress Tracking**: Liste tamamlanma göstergeleri
- **Tarih Yönetimi**: Başlangıç ve bitiş tarihleri
- **Enhanced UX**: Görselleştirilmiş görev kartları ve düzenli layout

#### Veri Katmanı

- **SQLite Entegrasyonu**: Offline veri depolama
- **Repository Pattern**: Clean data access layer
- **Migration Sistemi**: Veritabanı versiyonlama
- **Type Safety**: Comprehensive TypeScript types
- **Soft Delete**: Güvenli silme mekanizması

#### Kullanıcı Arayüzü

- **Custom Navigation**: Özel stack ve tab navigasyon
- **ThemeContext Sistemi**: Global tema yönetimi ve light/dark tema desteği
- **Modern Card Design**: Tutarlı card-based UI tasarımı
- **Material Design 3**: 48dp minimum touch targets ve modern standartlar
- **TaskActionSheet**: Gelişmiş görev menü sistemi
- **Modal/Sheet Support**: Görev detay ve oluşturma ekranları
- **Progress Indicators**: Liste tamamlanma göstergeleri
- **Safe Area**: iOS notch ve Android desteği
- **Enhanced Keyboard Handling**: Geliştirilmiş klavye davranışları

#### Teknik Altyapı

- **Clean Architecture**: Katmanlı mimari
- **Custom Components**: Yeniden kullanılabilir UI bileşenleri
- **Performance**: Optimize edilmiş queries
- **Platform Support**: iOS ve Android uyumluluğu

</details>

<details>
<summary><h2>🛠️ Teknoloji Stack</h2></summary>

### Frontend

- **React Native** 0.81.0 - Cross-platform mobil uygulama framework'ü
- **TypeScript** 5.8.3 - Type-safe JavaScript geliştirme
- **React** 19.1.0 - Kullanıcı arayüzü kütüphanesi

### Veritabanı

- **SQLite** - Yerel veri depolama
- **react-native-sqlite-storage** 6.0.1 - SQLite entegrasyonu

### Navigasyon ve UI

- **Custom Navigation** - Özel geliştirilmiş navigasyon sistemi
- **react-native-safe-area-context** - Güvenli alan yönetimi
- **Custom Components** - Özel UI bileşenleri

### Geliştirme Araçları

- **ESLint** - Kod kalitesi analizi
- **Prettier** - Kod formatlaması
- **Jest** - Unit testing framework'ü
- **Metro** - React Native bundler

### Platform Desteği

- **Android** - API 21+ (Android 5.0+)
- **iOS** - iOS 11.0+ (Xcode 14+ gerekli)
- **React Native** - 0.81.0 ve üzeri

</details>

<details>
<summary><h2>📦 Kurulum</h2></summary>

### 🔧 Sistem Gereksinimleri

- **Node.js** 18.0 veya üzeri
- **npm** veya **yarn** paket yöneticisi
- **React Native CLI** (`npm install -g @react-native-community/cli`)

#### Android Geliştirme

- **Android Studio** (API 21+ / Android 5.0+)
- **JDK** 11 veya üzeri
- **Android SDK** ve **Platform Tools**

#### iOS Geliştirme (macOS gerekli)

- **Xcode** 14+ (iOS 11.0+ desteği)
- **CocoaPods** (`sudo gem install cocoapods`)

### 🚀 Hızlı Başlangıç

1. **Projeyi klonlayın**

   ```bash
   git clone [repository-url]
   cd TodoMobile
   ```

2. **Bağımlılıkları yükleyin**

   ```bash
   # npm kullanıyorsanız
   npm install
   
   # yarn kullanıyorsanız  
   yarn install
   ```

3. **iOS için CocoaPods kurulumu** (sadece macOS)

   ```bash
   cd ios && pod install && cd ..
   ```

4. **Geliştirme ortamını başlatın**

   ```bash
   # Metro bundler'ı başlat
   npm start
   
   # Yeni terminal açıp uygulamayı çalıştırın
   npm run android  # Android için
   npm run ios      # iOS için (macOS gerekli)
   ```

### 🔍 Doğrulama

Kurulum sonrası aşağıdaki komutlarla her şeyin çalıştığından emin olun:

   ```bash
# TypeScript tip kontrolü
npx tsc --noEmit

# Linting
npm run lint

# Test çalıştırma
npm test
   ```

### Paketleme

**Android APK oluşturma:**

```bash
cd android
./gradlew assembleRelease
```

**iOS uygulaması oluşturma:**

```bash
npx react-native run-ios --configuration Release
```

</details>

<details>
<summary><h2>📁 Mevcut Proje Yapısı</h2></summary>

```text
TodoMobile/
├── app/                    # Presentation Layer
│   ├── boot/              # Uygulama başlatma
│   ├── components/        # UI bileşenleri
│   ├── navigation/        # Custom navigasyon sistemi
│   ├── screens/           # Ekranlar (Tasks, Settings)
│   ├── theme/            # Tema ve stil sistemi
│   └── utils/            # UI yardımcıları
├── src/                   # Data Layer
│   └── database/         # SQLite & Repository pattern
│       ├── repositories/ # Veri erişim katmanı
│       ├── migrations.ts # Şema versiyonlama
│       └── types.ts      # TypeScript tipleri
├── android/              # Android native
├── ios/                  # iOS native
└── __tests__/            # Test dosyaları
```

### Mevcut Mimari

- **Clean Architecture**: Katmanlı separation of concerns
- **Repository Pattern**: Data access abstraction
- **Custom Navigation**: Minimal dependencies
- **Theme System**: Design system altyapısı

</details>

<details>
<summary><h2>🚀 Planlanan Geliştirmeler</h2></summary>

### 🎯 Geliştirme Planı

Bu uygulama, mevcut kodu bozmadan kademeli iyileştirme süreci planlanan bir projedir. Her aşama bağımsız değer üretecek şekilde tasarlanmıştır.

### 🔧 **Altyapı ve Temel Geliştirmeler**

#### 📋 Proje Altyapısı ✅ **Kısmen Tamamlandı**

- ✅ **Repository Optimizasyonu**: Kapsamlı .gitignore güncellemeleri tamamlandı
- ✅ **Kod Kalitesi**: Enhanced linting rules ve formatting standartları
- **Git İş Akışı**: Korumalı dallar ve code review süreci *(devam ediyor)*
- **Otomatizasyon**: TypeScript strict mode, ESLint, CI/CD pipeline *(planlanıyor)*
- **Geliştirici Araçları**: Path aliases, Metro resolver optimizasyonu *(planlanıyor)*

#### 🏗️ Mimari İyileştirmeler ✅ **Büyük Oranda Tamamlandı**

- ✅ **ThemeContext Sistemi**: Global state management eklendi
- ✅ **Hata Yönetimi**: Enhanced error handling ve user feedback
- ✅ **UI/UX Standartları**: Modern card-based design sistemi
- **Durum Yönetimi**: Zustand ile merkezi state management *(gelecek sprint)*
- **Yükleme Durumları**: Loading states, skeleton screens *(planlanıyor)*
- **Klasör Yapısı**: Feature-based organization *(planlanıyor)*

### 🚀 **Performans ve Kullanıcı Deneyimi**

#### 🧭 Navigasyon Geliştirmeleri ✅ **Kısmen Tamamlandı**

- ✅ **Enhanced Navigation**: Geliştirilmiş navigasyon stack management
- ✅ **Modal Geçişleri**: Smooth transitions ve sheet support
- ✅ **Keyboard Handling**: Gelişmiş keyboard avoiding behavior
- **Tip Güvenliği**: Type-safe routing ve parametre yönetimi *(planlanıyor)*
- **Derin Bağlantılar**: URI-based navigation desteği *(planlanıyor)*
- **State Management**: Navigation state merkezi yönetimi *(planlanıyor)*

#### ⚡ Performans Optimizasyonları ✅ **Kısmen Tamamlandı**

- ✅ **Veritabanı**: Migration v2, enhanced TasksRepository, query optimization
- ✅ **Android Build**: Gradle optimization ve modern build configuration
- ✅ **Memory Management**: Better error handling ve performance improvements
- **Liste Optimizasyonu**: Virtualization ve lazy loading *(planlanıyor)*
- **Bundle**: Tree-shaking, code splitting, asset compression *(planlanıyor)*
- **Render Optimization**: Advanced memory leak prevention *(planlanıyor)*

### 🧪 **Kalite ve Test Altyapısı**

#### Test Sistemleri

- **Birim Testleri**: Jest setup, utility functions, custom hooks
- **Entegrasyon Testleri**: React Native Testing Library
- **Uçtan Uca Testler**: Temel smoke test senaryoları
- **Otomatizasyon**: CI/CD test pipeline entegrasyonu

#### Geliştirici Araçları

- **Dokümantasyon**: Architecture decision records, contributor guide
- **Commit Standartları**: Conventional commits ve automated changelog
- **Kod Kalitesi**: Advanced linting, formatting, type checking

</details>

<details>
<summary><h2>📊 Geliştirme Yol Haritası</h2></summary>

### 🎯 Proje Hedefleri

**TodoMobile için Öncelikli Alanlar:**

- 📝 **Görev Yönetimi**: Alt görevler, etiketler, kategoriler
- 🔄 **Senkronizasyon**: Offline-first yaklaşımı
- 🎨 **Kullanıcı Deneyimi**: Smooth animasyonlar, gesture support
- 📊 **Veri Görselleştirme**: Progress tracking, istatistikler
- 🔍 **Arama ve Filtreleme**: Gelişmiş arama özellikleri

### 📈 Kalite Metrikleri

**Takip Edilecek Ölçümler:**

- 🧪 **Test Kapsamı**: Minimum %80 test coverage
- 📱 **Uygulama Boyutu**: APK/IPA boyut optimizasyonu
- ⚡ **Performans**: 60 FPS liste scrolling
- 🐛 **Hata Oranı**: Crash-free sessions %99+
- 👤 **Kod Kalitesi**: TypeScript strict mode compliance

### 🔐 Risk Yönetimi

**TodoMobile Özel Riskler:**

- 💾 **Veri Kaybı**: SQLite backup stratejileri
- 🔄 **Migration**: Veritabanı şema değişiklikleri  
- 📱 **Platform Uyumluluğu**: iOS/Android parity
- 🔧 **Dependency Updates**: React Native version upgrades
- 👥 **Code Maintainability**: Documentation ve code organization

### 🎯 Hedeflenen Sonuç

**Proje Tamamlandığında:**

- ✅ **Modüler Mimari**: Feature-based organization
- ✅ **Offline Support**: Tam offline kullanılabilirlik
- ✅ **Modern UI/UX**: Material Design 3 / iOS Human Interface
- ✅ **Test Coverage**: Kapsamlı test suite
- ✅ **Developer Experience**: Hot reload, debugging tools
- ✅ **Production Ready**: Store deployment hazır

### 🚀 Katkıda Bulunma

Proje açık kaynak ve katkılara açıktır. Yeni özellik önerileri ve hata raporları için GitHub Issues kullanabilirsiniz.

</details>
