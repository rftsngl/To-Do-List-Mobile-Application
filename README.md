# TodoMobile - React Native To-Do Uygulaması

Bu, [`@react-native-community/cli`](https://github.com/react-native-community/cli) kullanılarak oluşturulmuş yeni bir [**React Native**](https://reactnative.dev) projesidir.

## Başlangıç

> **Not**: Devam etmeden önce [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) rehberini tamamladığınızdan emin olun.

### Adım 1: Metro'yu Başlatın

**Metro**'yu çalıştırmanız gerekiyor - React Native'in JavaScript build aracı.

Metro dev server'ı başlatmak için, React Native projenizin kök dizininden şu komutu çalıştırın:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

### Adım 2: Uygulamanızı Derleyin ve Çalıştırın

Metro çalışırken, React Native projenizin kök dizininden yeni bir terminal penceresi açın ve Android veya iOS uygulamanızı derlemek ve çalıştırmak için aşağıdaki komutlardan birini kullanın:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

iOS için CocoaPods bağımlılıklarını yüklemeyi unutmayın (bu sadece ilk klonlamada veya native bağımlılıkları güncelledikten sonra çalıştırılması gerekir).

Yeni bir proje oluştururken ilk kez, CocoaPods'u yüklemek için Ruby bundler'ı çalıştırın:

```sh
bundle install
```

Sonra, ve native bağımlılıklarınızı her güncellediğinizde şunu çalıştırın:

```sh
bundle exec pod install
```

Daha fazla bilgi için [CocoaPods Getting Started rehberini](https://guides.cocoapods.org/using/getting-started.html) ziyaret edin.

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

Her şey doğru şekilde kurulmuşsa, yeni uygulamanızın Android Emulator, iOS Simulator veya bağlı cihazınızda çalıştığını görmeniz gerekir.

Bu uygulamanızı çalıştırmanın bir yoludur — ayrıca doğrudan Android Studio veya Xcode'dan da derleyebilirsiniz.

## Adım 3: Uygulamanızı Düzenleyin

Artık uygulamayı başarıyla çalıştırdığınıza göre, değişiklikler yapalım!

`App.tsx` dosyasını tercih ettiğiniz metin editöründe açın ve bazı değişiklikler yapın. Kaydettiğinizde, uygulamanız otomatik olarak güncellenecek ve bu değişiklikleri yansıtacaktır — bu [Fast Refresh](https://reactnative.dev/docs/fast-refresh) ile desteklenmektedir.

Uygulamanızın durumunu sıfırlamak gibi zorla yeniden yüklemek istediğinizde, tam bir yeniden yükleme gerçekleştirebilirsiniz:

- **Android**: `R` tuşuna iki kez basın veya **Dev Menu**'den **"Reload"** seçeneğini seçin, `Ctrl + M` (Windows/Linux) veya `Cmd ⌘ + M` (macOS) ile erişilebilir.
- **iOS**: iOS Simulator'da `R` tuşuna basın.

## Tebrikler! :tada:

React Native Uygulamanızı başarıyla çalıştırdınız ve değiştirdiniz. :partying_face:

### Şimdi Ne Yapmalı?

- Bu yeni React Native kodunu mevcut bir uygulamaya eklemek istiyorsanız, [Integration rehberini](https://reactnative.dev/docs/integration-with-existing-apps) inceleyin.
- React Native hakkında daha fazla bilgi edinmek istiyorsanız, [dökümanları](https://reactnative.dev/docs/getting-started) inceleyin.

## Sorun Giderme

Yukarıdaki adımları uygularken sorun yaşıyorsanız, [Troubleshooting](https://reactnative.dev/docs/troubleshooting) sayfasına bakın.

## SQLite Veri Katmanı

Bu proje, React Native için SQLite tabanlı yerel veri katmanı içerir. Gelecekte senkronizasyon özellikli çok kullanıcılı sisteme geçiş için hazırlıklı olarak tasarlanmıştır.

## Kurulum

### 1. Bağımlılıkları Yükle

```bash
# TodoMobile dizininde
npm install

# iOS için CocoaPods
cd ios && pod install && cd ..
```

### 2. Uygulama Başlangıcında Veritabanını Başlat

```typescript
import { DatabaseManager, runMigrations, seedDatabase } from './src/database';

// App.tsx veya ana component'te
useEffect(() => {
  const initDatabase = async () => {
    try {
      await DatabaseManager.init();
      console.log('✅ Veritabanı hazır');
      
      // Geliştirme için test verisi (opsiyonel)
      // await seedDatabase();
    } catch (error) {
      console.error('❌ Veritabanı hatası:', error);
    }
  };

  initDatabase();
}, []);
```

## Kullanım Örnekleri

### Liste İşlemleri

```typescript
import { ListsRepository } from './src/database';

// Yeni liste oluştur
const newList = ListsRepository.create({
  name: 'Alışveriş Listesi',
  color: '#3B82F6'
});

// Tüm listeleri getir
const lists = ListsRepository.getAll();

// Liste güncelle
const updatedList = ListsRepository.update(newList.id, {
  name: 'Güncellenmiş Liste'
});

// Liste sil (soft delete)
ListsRepository.delete(newList.id);
```

### Görev İşlemleri

```typescript
import { TasksRepository } from './src/database';

// Yeni görev oluştur
const task = TasksRepository.create({
  list_id: 'liste-uuid',
  title: 'Önemli görev',
  description: 'Detaylı açıklama',
  status: 'todo',
  priority: 2,
  due_date: Date.now() + (24 * 60 * 60 * 1000) // 1 gün sonra
});

// Listeye göre görevleri getir (otomatik sıralama)
const listTasks = TasksRepository.getByList('liste-uuid');

// Status'a göre filtrele
const todoTasks = TasksRepository.getByStatus('liste-uuid', 'todo');

// Ajanda (tarih aralığı)
const agendaTasks = TasksRepository.getAgenda({
  start: Date.now(),
  end: Date.now() + (7 * 24 * 60 * 60 * 1000) // 1 hafta
});

// Vadesi geçmiş görevler
const overdueTasks = TasksRepository.getOverdue();

// Görevi tamamla
const completedTask = TasksRepository.markDone(task.id);
```

### Etiket İşlemleri

```typescript
import { LabelsRepository } from './src/database';

// Etiket oluştur
const label = LabelsRepository.create({
  name: 'Acil',
  color: '#EF4444'
});

// Göreve etiket ekle
LabelsRepository.addToTask('görev-uuid', label.id);

// Görevin etiketlerini getir
const taskLabels = LabelsRepository.getByTask('görev-uuid');

// Etikete göre görevleri getir
const urgentTasks = TasksRepository.getByLabel(label.id);
```

### Alt Görev İşlemleri

```typescript
import { SubtasksRepository } from './src/database';

// Alt görev oluştur
const subtask = SubtasksRepository.create({
  task_id: 'görev-uuid',
  title: 'Alt görev başlığı',
  sort_order: 1
});

// Alt görevi tamamla/geri al
const toggledSubtask = SubtasksRepository.toggleDone(subtask.id);

// Görevin alt görevlerini getir
const subtasks = SubtasksRepository.getByTask('görev-uuid');

// Alt görev istatistikleri
const stats = SubtasksRepository.getTaskStats('görev-uuid');
// { total: 5, completed: 3, pending: 2, completionRate: 60 }
```

## Veri Sıralaması

Görevler varsayılan olarak şu sıraya göre listelenir:

1. **Status Önceliği**: todo → in_progress → blocked → done
2. **Priority**: 3 (kritik) → 2 (yüksek) → 1 (normal) → 0 (düşük)  
3. **Due Date**: En yakın tarih üstte (NULLS LAST)
4. **Updated**: En son güncellenen üstte

### Manuel Sıralama

İleride manuel sıralama ihtiyacı çıkarsa:

```typescript
// Görevin sırasını güncelle
TasksRepository.updateSortOrder('görev-uuid', 1.5);

// Manuel sıralama ile getir
const customOrderTasks = TasksRepository.getByListWithCustomOrder('liste-uuid');
```

Manuel sıralama aktif olduğunda, `sort_order` değeri olan görevler önce gelir, sonra varsayılan sıralama uygulanır.

## Senkronizasyon Hazırlığı

Her kayıt senkronizasyon için hazır alanlar içerir:

- **`dirty`**: 0 = temiz, 1 = senkron bekliyor
- **`version`**: Her güncelleme ile artırılır
- **`deleted_at`**: Soft delete timestamp'i

### Kirli Kayıtları Alma

```typescript
// Senkron bekleyen kayıtları getir
const dirtyLists = ListsRepository.getDirty();
const dirtyTasks = TasksRepository.getDirty();
const dirtyLabels = LabelsRepository.getDirty();

// Senkron sonrası temizle
ListsRepository.markClean('liste-uuid', newVersion);
```

### Senkron Senaryosu (Gelecek)

1. Kirli kayıtları topla (`getDirty()`)
2. Server'a gönder
3. Server response'ında yeni version'ları al
4. `markClean(id, newVersion)` ile temizle

## Test ve Geliştirme

### Test Verisi Oluşturma

```typescript
import { seedDatabase, smokeTest, quickTest } from './src/database';

// Test verisi oluştur
await seedDatabase();

// Duman testi çalıştır
await smokeTest();

// Hızlı test (init + seed + smoke)
await quickTest();
```

### Veritabanı Sıfırlama

```typescript
import { DatabaseManager, resetAndSeed } from './src/database';

// Geliştirme için veritabanını sıfırla
await DatabaseManager.reset();

// Sıfırla ve test verisi ekle
await resetAndSeed();
```

### Migration İşlemleri

```typescript
import { getCurrentVersion, rollbackTo } from './src/database';

// Mevcut version'ı kontrol et
const version = await getCurrentVersion(DatabaseManager.getDB());

// Geliştirme için rollback (dikkatli kullanın!)
await rollbackTo(DatabaseManager.getDB(), 0);
```

## Veritabanı Yapısı

### Tablolar

- **`lists`**: Görev listeleri
- **`tasks`**: Görevler
- **`labels`**: Etiketler  
- **`task_labels`**: Görev-etiket ilişki tablosu
- **`subtasks`**: Alt görevler
- **`schema_migrations`**: Migration sürüm takibi

### İndeksler

Performans için önceden tanımlanmış indeksler:

- Görev listesi + status + priority + due_date
- Due date sorguları için
- Etiket ilişkileri için
- Dirty flag sorguları için

### Trigger'lar

Otomatik timestamp ve sürüm yönetimi için trigger'lar her tabloda aktif.

## Performans Notları

- WAL modu aktif (eş zamanlı okuma/yazma)
- Foreign key'ler aktif
- Prepared statement'lar kullanılıyor
- Transaction destekli toplu işlemler
- İndeksli sorgular

## Daha Fazla Öğrenin

React Native hakkında daha fazla bilgi edinmek için aşağıdaki kaynaklara bakın:

- [React Native Website](https://reactnative.dev) - React Native hakkında daha fazla bilgi edinin.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - React Native'e **genel bakış** ve ortamınızı nasıl kuracağınız.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - React Native **temellerinin** **rehberli turu**.
- [Blog](https://reactnative.dev/blog) - en son resmi React Native **Blog** gönderilerini okuyun.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - React Native için Açık Kaynak GitHub **deposu**.
