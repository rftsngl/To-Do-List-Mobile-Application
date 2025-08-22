# TodoMobile - Gelişmiş Görev Yönetim Uygulaması

[![React Native](https://img.shields.io/badge/React%20Native-0.81.0-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-react--native--sqlite--storage-green.svg)](https://www.npmjs.com/package/react-native-sqlite-storage)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 İçindekiler

- [Genel Bakış](#genel-bakış)
- [Özellikler](#özellikler)
- [Teknoloji Stack](#teknoloji-stack)
- [Kurulum](#kurulum)
- [Proje Yapısı](#proje-yapısı)
- [Veritabanı Şeması](#veritabanı-şeması)
- [Ekran Görüntüleri](#ekran-görüntüleri)
- [API Referansı](#api-referansı)
- [Geliştirme](#geliştirme)
- [Katkıda Bulunma](#katkıda-bulunma)
- [Lisans](#lisans)

## 🚀 Genel Bakış

TodoMobile, modern mobil uygulama geliştirme teknolojileri kullanılarak geliştirilmiş, tam özellikli bir görev yönetim uygulamasıdır. Uygulama, kullanıcıların görevlerini organize etmelerine, önceliklendirmelerine ve takip etmelerine olanak tanır.

### Temel Hedefler

- ✨ Modern ve sezgisel kullanıcı arayüzü
- 📱 Cross-platform mobil deneyim (iOS & Android)
- 🗃️ Yerel veri depolama ve offline çalışma
- ⚡ Yüksek performans ve akıcı kullanım
- 🛠️ Genişletilebilir ve sürdürülebilir kod yapısı

## 🌟 Özellikler

### Görev Yönetimi

- **Görev Oluşturma**: Başlık, açıklama, öncelik ve tarih bilgileri
- **Durum Takibi**: Todo, İşlemde, Engellendi, Tamamlandı durumları
- **Öncelik Seviyeleri**: Düşük, Normal, Yüksek, Kritik (0-3)
- **Alt Görevler**: Görevleri daha küçük parçalara bölme
- **Tarih Yönetimi**: Başlangıç ve bitiş tarihleri

### Organizasyon

- **Liste Yönetimi**: Görevleri kategorilere ayırma
- **Etiket Sistemi**: Görevlere çoklu etiket atama
- **Renk Kodlama**: Liste ve etiketler için renk desteği
- **Sıralama**: Manuel sıralama ve otomatik sıralama seçenekleri

### Kullanıcı Deneyimi

- **Tab Navigasyon**: Görevler ve Ayarlar sekmeleri
- **Modal Ekranlar**: Görev detayları ve yeni görev oluşturma
- **Tema Desteği**: Açık ve koyu tema seçenekleri
- **Duyarlı Tasarım**: Farklı ekran boyutlarına uyum

### Teknik Özellikler

- **Offline Çalışma**: İnternet bağlantısı olmadan tam işlevsellik
- **Veri Senkronizasyonu**: Gelecekte online senkronizasyon desteği
- **Performans Optimizasyonu**: Lazy loading ve verimli render
- **Hata Yönetimi**: Kapsamlı hata yakalama ve raporlama

## 🛠️ Teknoloji Stack

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

- **Android** - Minimum SDK 21 (Android 5.0)
- **iOS** - Minimum iOS 11.0

## 📦 Kurulum

### Gereksinimler

- Node.js 18.0 veya üzeri
- React Native CLI
- Android Studio (Android geliştirme için)
- Xcode (iOS geliştirme için)

### Adım Adım Kurulum

1. **Repository'yi klonlayın**

   ```bash
   git clone https://github.com/kullaniciadi/to-do-app.git
   cd to-do-app/TodoMobile
   ```

2. **Bağımlılıkları yükleyin**

   ```bash
   npm install
   ```

3. **iOS için ek kurulum** (macOS üzerinde)

   ```bash
   cd ios && pod install && cd ..
   ```

4. **Geliştirme sunucusunu başlatın**

   ```bash
   npm start
   ```

5. **Uygulamayı çalıştırın**

   Android için:

   ```bash
   npm run android
   ```

   iOS için:

   ```bash
   npm run ios
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

## 📁 Proje Yapısı

```text
TodoMobile/
├── android/                 # Android native kodu
├── ios/                    # iOS native kodu
├── app/                    # Ana uygulama kodu
│   ├── boot/              # Uygulama başlatma
│   │   └── InitGate.tsx   # Veritabanı başlatma
│   ├── components/        # Yeniden kullanılabilir bileşenler
│   │   ├── FAB.tsx       # Floating Action Button
│   │   ├── ListItem.tsx  # Liste öğesi bileşeni
│   │   ├── SegmentedControl.tsx
│   │   └── Sheet.tsx     # Modal sheet bileşeni
│   ├── navigation/        # Navigasyon sistemi
│   │   ├── Stack.tsx     # Stack navigator
│   │   └── Tabs.tsx      # Tab navigator
│   ├── screens/           # Uygulama ekranları
│   │   ├── Tasks/        # Görev ekranları
│   │   │   ├── components/
│   │   │   │   └── SubtasksPanel.tsx
│   │   │   ├── NewTaskSheet.tsx
│   │   │   ├── TaskDetailScreen.tsx
│   │   │   └── TasksScreen.tsx
│   │   ├── Settings/     # Ayar ekranları
│   │   │   ├── ManageLabelsScreen.tsx
│   │   │   ├── ManageListsScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   └── DBCheckScreen.tsx
│   ├── theme/            # Tema ve stil tanımları
│   │   └── theme.ts
│   └── utils/            # Yardımcı fonksiyonlar
│       ├── date.ts       # Tarih işlemleri
│       └── status.ts     # Durum yönetimi
├── src/                  # Veri katmanı
│   └── database/         # Veritabanı yönetimi
│       ├── db.ts         # Veritabanı manager
│       ├── id.ts         # ID generation
│       ├── index.ts      # Dışa aktarma
│       ├── migrations.ts # Veritabanı migrationları
│       ├── repositories/ # Veri erişim katmanı
│       │   ├── labels.ts
│       │   ├── lists.ts
│       │   ├── subtasks.ts
│       │   └── tasks.ts
│       ├── seed.ts       # Test verisi
│       └── types.ts      # TypeScript tipleri
├── __tests__/            # Test dosyaları
├── node_modules/         # Bağımlılıklar
├── App.tsx              # Ana uygulama bileşeni
├── index.js             # Uygulama giriş noktası
├── package.json         # Proje yapılandırması
└── README.md            # Proje dokümantasyonu
```

### Mimari Yaklaşım

Uygulama **Clean Architecture** prensipleri takip ederek geliştirilmiştir:

- **Presentation Layer** (`app/`): UI bileşenleri ve ekranlar
- **Business Logic Layer** (`src/repositories/`): İş mantığı ve veri işlemleri
- **Data Layer** (`src/database/`): Veri erişimi ve depolama

## 🗄️ Veritabanı Şeması

### Ana Tablolar

#### Lists Tablosu
```sql
CREATE TABLE lists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER,
  version INTEGER NOT NULL DEFAULT 1,
  dirty INTEGER NOT NULL DEFAULT 0
);
```

#### Tasks Tablosu
```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  list_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('todo', 'in_progress', 'blocked', 'done')),
  priority INTEGER NOT NULL CHECK (priority IN (0, 1, 2, 3)),
  start_date INTEGER,
  due_date INTEGER,
  completed_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER,
  version INTEGER NOT NULL DEFAULT 1,
  dirty INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER,
  FOREIGN KEY (list_id) REFERENCES lists(id)
);
```

#### Labels Tablosu
```sql
CREATE TABLE labels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER,
  version INTEGER NOT NULL DEFAULT 1,
  dirty INTEGER NOT NULL DEFAULT 0
);
```

#### Task_Labels İlişki Tablosu
```sql
CREATE TABLE task_labels (
  task_id TEXT NOT NULL,
  label_id TEXT NOT NULL,
  PRIMARY KEY (task_id, label_id),
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE
);
```

#### Subtasks Tablosu
```sql
CREATE TABLE subtasks (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  title TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER,
  version INTEGER NOT NULL DEFAULT 1,
  dirty INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);
```

### İndeksler ve Optimizasyonlar

```sql
-- Performans için önemli indeksler
CREATE INDEX idx_tasks_list_id ON tasks(list_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_subtasks_task_id ON subtasks(task_id);
CREATE INDEX idx_task_labels_task_id ON task_labels(task_id);
CREATE INDEX idx_task_labels_label_id ON task_labels(label_id);
```

### Veri Tipleri

#### TaskStatus Enum
- `todo`: Yapılacak
- `in_progress`: İşlemde
- `blocked`: Engellendi
- `done`: Tamamlandı

#### TaskPriority Seviyeleri
- `0`: Düşük öncelik
- `1`: Normal öncelik
- `2`: Yüksek öncelik
- `3`: Kritik öncelik

## 📸 Ekran Görüntüleri

> **Not**: Ekran görüntüleri ekleme sürecindedir.

| Ana Ekran | Görev Detayı | Ayarlar |
|-----------|--------------|---------|
| Coming Soon | Coming Soon | Coming Soon |

## 📚 API Referansı

### Task Repository

#### Görev İşlemleri

```typescript
// Tüm görevleri getir
const tasks = await TaskRepository.getAll();

// ID ile görev getir
const task = await TaskRepository.getById('task-id');

// Yeni görev oluştur
const newTask = await TaskRepository.create({
  title: 'Yeni Görev',
  listId: 'list-id',
  status: 'todo',
  priority: 1
});

// Görev güncelle
await TaskRepository.update('task-id', {
  title: 'Güncellenmiş Görev',
  status: 'done'
});

// Görev sil
await TaskRepository.delete('task-id');
```

### List Repository

```typescript
// Liste oluştur
const list = await ListRepository.create({
  name: 'İş Görevleri',
  color: '#FF5722'
});

// Listeye göre görevleri getir
const tasks = await TaskRepository.getByListId('list-id');
```

### Label Repository

```typescript
// Etiket oluştur
const label = await LabelRepository.create({
  name: 'Acil',
  color: '#F44336'
});

// Göreve etiket ata
await TaskRepository.addLabel('task-id', 'label-id');
```

## 🔧 Geliştirme

### Kod Kalitesi

```bash
# Linting
npm run lint

# Formatting
npx prettier --write .

# Type checking
npx tsc --noEmit
```

### Testing

```bash
# Unit testleri çalıştır
npm test

# Test coverage
npm test -- --coverage
```

### Debugging

1. **React Native Debugger** kullanın
2. **Console logging** için `console.log()` ekleyin
3. **Database debugging** için DB Check ekranını kullanın

### Environment Configuration

Geliştirme ortamı için `.env` dosyası oluşturun:

```env
NODE_ENV=development
DEBUG=true
```

## 🤝 Katkıda Bulunma

### Katkı Süreci

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

### Kod Standartları

- **TypeScript** kullanın
- **ESLint** kurallarına uyun
- **Prettier** ile kodu formatlayın
- Değişiklikler için **test** yazın
- **Meaningful commit messages** kullanın

### İssue Raporlama

Bug raporu veya feature request için GitHub Issues kullanın:

1. Detaylı açıklama yapın
2. Reproduction steps ekleyin
3. Platform bilgilerini belirtin
4. Ekran görüntüsü ekleyin (gerekiyorsa)

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasını inceleyin.

```
MIT License

Copyright (c) 2025 Rıfat Sinanoğlu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 İletişim

- **Geliştirici**: Rıfat Sinanoğlu
- **Email**: [email@example.com](mailto:email@example.com)
- **GitHub**: [@username](https://github.com/username)
- **LinkedIn**: [linkedin.com/in/username](https://linkedin.com/in/username)

---

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**

**Herhangi bir sorunuz olursa issue açmaktan çekinmeyin.**