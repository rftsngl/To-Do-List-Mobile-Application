# SQLite Veri Katmanı Kurulum Yönergesi

## 1. Paket Kurulumu

```bash
# TodoMobile dizininde
npm install

# iOS için (gerekirse)
cd ios && pod install && cd ..
```

## 2. Android Gradle Ayarları

`react-native-quick-sqlite` Yeni Mimari (TurboModules) ile uyumludur. Ek Gradle ayarı gerekmez.

## 3. Migration ve Seed Çalıştırma

```typescript
import { DatabaseManager } from './src/database/db';
import { runMigrations } from './src/database/migrations';
import { seedDatabase } from './src/database/seed';

// Uygulama başlangıcında
await DatabaseManager.init();
await runMigrations();
await seedDatabase(); // Yalnızca geliştirme için
```

## 4. Notlar

- SQLite dosyası cihazda yerel olarak saklanır
- İleride senkronizasyon için `dirty` ve `version` alanları hazır
- Performans için indeksler önceden tanımlı
