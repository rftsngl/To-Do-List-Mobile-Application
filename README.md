# TaskFlow - Görev Yönetim Uygulaması

![Version](https://img.shields.io/badge/Version-0.0.2-blue.svg)
[![Node](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org/)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-lightgrey.svg)
[![ESLint](https://img.shields.io/badge/Code%20Style-ESLint-blueviolet.svg)](https://eslint.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.0-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-react--native--sqlite--storage-green.svg)](https://www.npmjs.com/package/react-native-sqlite-storage)

## 🚀 Genel Bakış

TaskFlow, React Native ve TypeScript kullanılarak geliştirilmiş, offline çalışabilen basit görev yönetim uygulamasıdır. SQLite ile yerel veri depolama sağlar ve clean architecture prensiplerine uygun olarak tasarlanmıştır.

## ✨ Özellikler

- ✅ Görev oluşturma, düzenleme ve silme
- ✅ Alt görev desteği
- ✅ Görev öncelik sistemi
- ✅ Offline çalışma
- ✅ Modern kullanıcı arayüzü
- ✅ Dark/Light tema desteği

## 🛠️ Teknoloji Stack

- **React Native** 0.81.0
- **TypeScript** 5.8.3
- **React** 18.2.0
- **SQLite** (react-native-sqlite-storage)
- **Custom Navigation**

**Platform Desteği:**

- Android API 21+ (Android 5.0+)
- iOS 11.0+ (Xcode 14+ gerekli)

## 📦 Kurulum

### Sistem Gereksinimleri

- Node.js 18.0+
- React Native CLI
- Android Studio (Android için)
- Xcode 14+ (iOS için - sadece macOS)

### Hızlı Başlangıç

```bash
# Projeyi klonlayın
git clone <repository-url>
cd TodoMobile

# Bağımlılıkları yükleyin
npm install

# iOS için (sadece macOS)
cd ios && pod install && cd ..

# Uygulamayı çalıştırın
npm run android  # Android
npm run ios      # iOS
```

## 📁 Proje Yapısı

```text
TaskFlow/
├── app/           # UI katmanı (screens, components, navigation)
├── src/database/  # Veri katmanı (SQLite, repositories)
├── android/       # Android native
├── ios/           # iOS native
└── __tests__/     # Test dosyaları
```

## 🚀 Katkıda Bulunma

Proje geliştirmeye açıktır. Önerileriniz ve katkılarınız için lütfen GitHub Issues kullanın.
