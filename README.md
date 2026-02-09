# TaskFlow - Modern Görev Yönetim Uygulaması

![Version](https://img.shields.io/badge/Version-0.0.2-blue.svg)
[![Node](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org/)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-lightgrey.svg)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.0-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-6.0.1-green.svg)](https://www.npmjs.com/package/react-native-sqlite-storage)

## 📱 Genel Bakış

TaskFlow, React Native ve TypeScript kullanılarak geliştirilmiş, offline-first mimariye sahip modern bir görev yönetim uygulamasıdır. SQLite ile yerel veri depolama sağlar ve clean architecture prensiplerine uygun olarak tasarlanmıştır.

## ✨ Özellikler

- ✅ **Görev Yönetimi**: Oluşturma, düzenleme, silme ve arşivleme
- ✅ **Alt Görev Sistemi**: Her görev için detaylı alt görevler
- ✅ **Öncelik Sistemi**: Düşük, normal, yüksek öncelik seviyeleri
- ✅ **Liste Organizasyonu**: Özelleştirilebilir liste kategorileri
- ✅ **Etiket Desteği**: Görevleri etiketlerle organize edin
- ✅ **Offline Çalışma**: İnternet bağlantısı gerektirmez
- ✅ **Tema Desteği**: Dark/Light mod
- ✅ **Modern UI/UX**: Gesture tabanlı etkileşimler ve animasyonlar

## 🛠️ Teknoloji Stack

### Core
- **React Native** 0.81.0 - Cross-platform mobile framework
- **TypeScript** 5.8.3 - Type-safe development
- **React** 18.2.0 - UI library

### Database & State
- **SQLite** (react-native-sqlite-storage 6.0.1) - Offline-first local database

### UI & Animations
- **React Native Reanimated** 3.8.1 - Smooth animations
- **React Native Gesture Handler** 2.14.0 - Advanced gesture recognition
- **Safe Area Context** 5.5.2 - Safe area handling

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Unit testing

## 🏗️ Proje Mimarisi

```text
TodoMobile/
├── Application/              # Ana uygulama klasörü
│   ├── app/                 # UI Katmanı
│   │   ├── boot/           # Uygulama başlatma
│   │   ├── components/     # Reusable UI bileşenleri
│   │   ├── navigation/     # Navigation yapıları
│   │   ├── screens/        # Ekranlar
│   │   ├── theme/          # Tema konfigürasyonu
│   │   └── utils/          # Yardımcı fonksiyonlar
│   ├── src/                # Core Katmanı
│   │   └── database/       # Database katmanı
│   │       ├── repositories/  # Data access layer
│   │       ├── db.ts         # Database konfigürasyonu
│   │       ├── migrations.ts # Schema migrations
│   │       ├── seed.ts       # Initial data
│   │       └── types.ts      # Type definitions
│   ├── android/            # Android native
│   ├── ios/                # iOS native
│   └── __tests__/          # Test dosyaları
├── .gitignore
├── LICENSE
└── README.md
```

### Katman Açıklaması

**UI Katmanı (`app/`)**
- Kullanıcı arayüzü bileşenleri
- Ekran navigasyonu
- Tema ve stil yönetimi

**Core Katmanı (`src/database/`)**
- SQLite veritabanı yönetimi
- Repository pattern implementasyonu
- Data modelleri ve migrations

**Native Katmanlar**
- Platform-specific kodlar
- Native modül entegrasyonları

## 📋 Gereksinimler

### Zorunlu
- **Node.js** 18.0 veya üzeri
- **npm** veya **yarn**
- **React Native CLI**

### Platform Gereksinimleri

#### Android
- **Android Studio** Arctic Fox veya üzeri
- **JDK** 11 veya üzeri
- **Android SDK** API Level 21+ (Android 5.0+)
- **Android Emulator** veya fiziksel cihaz

#### iOS (Sadece macOS)
- **macOS** 11.0 veya üzeri
- **Xcode** 14.0 veya üzeri
- **CocoaPods** 1.11 veya üzeri
- **iOS Simulator** veya fiziksel cihaz (iOS 11.0+)

## 🚀 Kurulum

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/rftsngl/To-Do-List-Mobile-Application.git
cd To-Do-List-Mobile-Application/Application
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Platform-Specific Kurulum

#### iOS (Sadece macOS)
```bash
cd ios
pod install
cd ..
```

#### Android
Özel bir kurulum gerektirmez. Android Studio'nun düzgün kurulu olduğundan emin olun.

## 🎯 Uygulamayı Çalıştırma

### Development Mode

#### Android
```bash
npm run android
```

veya

```bash
npx react-native run-android
```

#### iOS (Sadece macOS)
```bash
npm run ios
```

veya

```bash
npx react-native run-ios
```

### Metro Bundler'ı Ayrı Başlatma

```bash
npm start
```

## 🧪 Test

```bash
npm test
```

## 🎨 Code Quality

### Linting
```bash
npm run lint
```

### Format Kontrolü
```bash
npm run prettier:check
```

## 📦 Build

### Android APK
```bash
cd android
./gradlew assembleRelease
```

APK konumu: `android/app/build/outputs/apk/release/`

### Android AAB (Google Play)
```bash
cd android
./gradlew bundleRelease
```

AAB konumu: `android/app/build/outputs/bundle/release/`

### iOS (Sadece macOS)
1. Xcode'da projeyi açın: `Application/ios/TodoMobile.xcworkspace`
2. Product → Archive
3. Distribute App

## 🔧 Sorun Giderme

### Android Build Hataları
```bash
cd Application/android
./gradlew clean
cd ..
npx react-native run-android
```

### iOS Build Hataları
```bash
cd Application/ios
pod deintegrate
pod install
cd ..
npx react-native run-ios
```

### Metro Bundler Sorunları
```bash
npx react-native start --reset-cache
```

### Node Modules Temizleme
```bash
cd Application
rm -rf node_modules
npm install
```

## 🔐 Güvenlik

- Debug keystore sadece development için kullanılır
- Production için kendi keystore'unuzu oluşturun
- Hassas bilgileri `.env` dosyasında saklayın (repo'ya eklenmiyor)

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👥 Katkıda Bulunma

1. Bu repo'yu fork edin
2. Feature branch'i oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim & Destek

- **GitHub Issues**: Bug raporları ve özellik istekleri için
- **Discussions**: Genel sorular ve tartışmalar için

## 🔄 Versiyon Geçmişi

- **0.0.2** (Current) - İlk stabil sürüm
  - Temel görev yönetimi özellikleri
  - SQLite entegrasyonu
  - Dark/Light tema desteği

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
