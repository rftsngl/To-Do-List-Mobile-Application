/**
 * Test verisi ve veritabanı seed fonksiyonları
 */

import { DatabaseManager } from './db';
import { ListsRepository } from './repositories/lists';
import { TasksRepository } from './repositories/tasks';
import { LabelsRepository } from './repositories/labels';
import { SubtasksRepository } from './repositories/subtasks';
import { addDays, now } from './id';

/**
 * Veritabanını test verisi ile seed et
 */
export async function seedDatabase(): Promise<void> {
  console.log('[Seed] Veritabanı test verisi oluşturuluyor...');

  try {
    await DatabaseManager.transaction(async () => {
      // Mevcut verileri kontrol et
      const existingLists = await ListsRepository.getAll();
      if (existingLists.length > 0) {
        console.log('[Seed] Veritabanında zaten veri var, seed atlanıyor');
        return;
      }

      // 1. Listeler oluştur
      const personalList = await ListsRepository.create({
        name: 'Kişisel',
        color: '#3B82F6'
      });

      const workList = await ListsRepository.create({
        name: 'İş',
        color: '#EF4444'
      });

      console.log('[Seed] 2 liste oluşturuldu');

      // 2. Etiketler oluştur
      const urgentLabel = await LabelsRepository.create({
        name: 'Acil',
        color: '#DC2626'
      });

      const importantLabel = await LabelsRepository.create({
        name: 'Önemli',
        color: '#F59E0B'
      });

      const meetingLabel = await LabelsRepository.create({
        name: 'Toplantı',
        color: '#8B5CF6'
      });

      console.log('[Seed] 3 etiket oluşturuldu');

      // 3. Görevler oluştur
      const tasks = [];

      // Kişisel görevler
      tasks.push(await TasksRepository.create({
        list_id: personalList.id,
        title: 'Market alışverişi yap',
        description: 'Süt, ekmek, meyve almayı unutma',
        status: 'todo',
        priority: 1,
        due_date: addDays(2)
      }));

      tasks.push(await TasksRepository.create({
        list_id: personalList.id,
        title: 'Spor salonuna git',
        description: 'Bugün bacak günü',
        status: 'todo',
        priority: 2,
        start_date: now(),
        due_date: addDays(0) // Bugün
      }));

      tasks.push(await TasksRepository.create({
        list_id: personalList.id,
        title: 'Kitap oku',
        description: 'Yerli ve Milli romanı bitir',
        status: 'in_progress',
        priority: 1,
        due_date: addDays(7)
      }));

      tasks.push(await TasksRepository.create({
        list_id: personalList.id,
        title: 'Doktor randevusu al',
        status: 'blocked',
        priority: 3,
        due_date: addDays(3)
      }));

      tasks.push(await TasksRepository.create({
        list_id: personalList.id,
        title: 'Eski telefonu sat',
        description: 'İkinci el pazar yerlerinde araştır',
        status: 'done',
        priority: 0,
        due_date: addDays(-2) // 2 gün önce vadesi geçmiş ama tamamlanmış
      }));

      // İş görevleri
      tasks.push(await TasksRepository.create({
        list_id: workList.id,
        title: 'Proje sunumunu hazırla',
        description: 'Q1 sonuçları ve Q2 planları',
        status: 'in_progress',
        priority: 3,
        due_date: addDays(1) // Yarın
      }));

      tasks.push(await TasksRepository.create({
        list_id: workList.id,
        title: 'Müşteri toplantısı',
        description: 'ABC Şirketi ile yeni anlaşma görüşmeleri',
        status: 'todo',
        priority: 3,
        start_date: addDays(1),
        due_date: addDays(1)
      }));

      tasks.push(await TasksRepository.create({
        list_id: workList.id,
        title: 'Kod incelemesi yap',
        description: 'Feature/user-auth branch\'ini incele',
        status: 'todo',
        priority: 2,
        due_date: addDays(2)
      }));

      tasks.push(await TasksRepository.create({
        list_id: workList.id,
        title: 'Performans raporu hazırla',
        description: 'Takım üyelerinin Q1 değerlendirmesi',
        status: 'blocked',
        priority: 2,
        due_date: addDays(5)
      }));

      tasks.push(await TasksRepository.create({
        list_id: workList.id,
        title: 'Ofis malzemesi siparişi',
        status: 'done',
        priority: 1,
        due_date: addDays(-1)
      }));

      // Vadesi geçmiş görevler
      tasks.push(await TasksRepository.create({
        list_id: workList.id,
        title: 'Aylık bütçe raporu',
        description: 'Mart ayı harcama analizi',
        status: 'todo',
        priority: 2,
        due_date: addDays(-3) // 3 gün önce vadesi geçmiş
      }));

      tasks.push(await TasksRepository.create({
        list_id: personalList.id,
        title: 'Araç muayenesi',
        description: 'Randevu al ve belgelerimi hazırla',
        status: 'todo',
        priority: 3,
        due_date: addDays(-1) // Dün vadesi geçmiş
      }));

      console.log(`[Seed] ${tasks.length} görev oluşturuldu`);

      // 4. Görev-etiket ilişkileri
      const labelAssignments = [
        { taskIndex: 1, labelId: urgentLabel.id }, // Spor - Acil
        { taskIndex: 3, labelId: urgentLabel.id }, // Doktor - Acil
        { taskIndex: 3, labelId: importantLabel.id }, // Doktor - Önemli
        { taskIndex: 5, labelId: importantLabel.id }, // Proje sunumu - Önemli
        { taskIndex: 5, labelId: urgentLabel.id }, // Proje sunumu - Acil
        { taskIndex: 6, labelId: meetingLabel.id }, // Müşteri toplantısı - Toplantı
        { taskIndex: 6, labelId: importantLabel.id }, // Müşteri toplantısı - Önemli
        { taskIndex: 10, labelId: urgentLabel.id }, // Aylık bütçe - Acil
        { taskIndex: 11, labelId: urgentLabel.id }, // Araç muayenesi - Acil
      ];

      for (const assignment of labelAssignments) {
        const task = tasks[assignment.taskIndex];
        if (task) {
          await LabelsRepository.addToTask(task.id, assignment.labelId);
        }
      }

      console.log(`[Seed] ${labelAssignments.length} etiket ilişkisi oluşturuldu`);

      // 5. Alt görevler
      const subtaskData = [
        {
          taskIndex: 0, // Market alışverişi
          subtasks: [
            'Alışveriş listesi hazırla',
            'En yakın marketi araştır',
            'Bütçe belirle'
          ]
        },
        {
          taskIndex: 2, // Kitap oku
          subtasks: [
            'Kaldığım sayfayı bul',
            'Günde 20 sayfa oku',
            'Notlar al'
          ]
        },
        {
          taskIndex: 5, // Proje sunumu
          subtasks: [
            'Q1 verilerini topla',
            'Grafik ve chart\'ları hazırla',
            'Sunum taslağı oluştur',
            'Slide tasarımını tamamla',
            'Provalar yap'
          ]
        },
        {
          taskIndex: 7, // Kod incelemesi
          subtasks: [
            'Branch\'i pull et',
            'Test coverage\'ını kontrol et',
            'Code style guideline uyumunu kontrol et',
            'Comments yaz'
          ]
        }
      ];

      let totalSubtasks = 0;
      for (const data of subtaskData) {
        const task = tasks[data.taskIndex];
        if (task) {
          for (let index = 0; index < data.subtasks.length; index++) {
            const title = data.subtasks[index];
            await (SubtasksRepository as any).create({
              task_id: task.id,
              title,
              done: Math.random() > 0.7 ? 1 : 0, // %30 ihtimalle tamamlanmış
              sort_order: index + 1
            });
            totalSubtasks++;
          }
        }
      }

      console.log(`[Seed] ${totalSubtasks} alt görev oluşturuldu`);
    });

    console.log('[Seed] ✅ Test verisi başarıyla oluşturuldu');
  } catch (error) {
    console.error('[Seed] ❌ Test verisi oluşturma hatası:', error);
    throw error;
  }
}

/**
 * Duman testi - Temel fonksiyonları kontrol et
 */
export async function smokeTest(): Promise<void> {
  console.log('\n[Smoke Test] Veritabanı duman testi başlıyor...');

  try {
    // 1. Migration durumunu kontrol et
    const stats = await DatabaseManager.getStats();
    console.log('[Smoke Test] DB Stats:', {
      version: stats.version,
      tables: stats.tables.length,
      size: `${Math.round(stats.dbSize / 1024)}KB`
    });

    // 2. Listeleri kontrol et
    const lists = await ListsRepository.getAll();
    console.log(`[Smoke Test] ✓ ${lists.length} liste bulundu`);
    if (lists.length > 0) {
      console.log(`[Smoke Test]   İlk liste: "${lists[0].name}"`);
    }

    // 3. Görevleri kontrol et
    const allTasks = await TasksRepository.getByList(lists[0]?.id || '');
    console.log(`[Smoke Test] ✓ ${allTasks.length} görev bulundu (ilk listede)`);

    // 4. Status'a göre görevleri kontrol et
    const todoTasks = await TasksRepository.getByStatus(lists[0]?.id || '', 'todo');
    const doneTasks = await TasksRepository.getByStatus(lists[0]?.id || '', 'done');
    console.log(`[Smoke Test] ✓ ToDo: ${todoTasks.length}, Tamamlanan: ${doneTasks.length}`);

    // 5. Ajanda testi
    const today = now();
    const nextWeek = addDays(7);
    const agendaTasks = await TasksRepository.getAgenda({ start: today, end: nextWeek });
    console.log(`[Smoke Test] ✓ Bu hafta ajandası: ${agendaTasks.length} görev`);

    // 6. Vadesi geçmiş görevler
    const overdueTasks = await TasksRepository.getOverdue();
    console.log(`[Smoke Test] ✓ Vadesi geçmiş: ${overdueTasks.length} görev`);

    // 7. Etiket testi
    const labels = await LabelsRepository.getAll();
    console.log(`[Smoke Test] ✓ ${labels.length} etiket bulundu`);

    if (labels.length > 0) {
      const labelTasks = await TasksRepository.getByLabel(labels[0].id);
      console.log(`[Smoke Test] ✓ "${labels[0].name}" etiketi: ${labelTasks.length} görev`);
    }

    // 8. Alt görev testi
    if (allTasks.length > 0) {
      const subtasks = await SubtasksRepository.getByTask(allTasks[0].id);
      console.log(`[Smoke Test] ✓ İlk görevin alt görevleri: ${subtasks.length}`);

      if (subtasks.length > 0) {
        const subtaskStats = await (SubtasksRepository as any).getTaskStats(allTasks[0].id);
        console.log(`[Smoke Test] ✓ Alt görev istatistikleri: %${subtaskStats.completionRate} tamamlanma`);
      }
    }

    // 9. Kirli kayıt testi
    const dirtyLists = await ListsRepository.getDirty();
    const dirtyTasks = await TasksRepository.getDirty();
    const dirtyLabels = await LabelsRepository.getDirty();
    console.log(`[Smoke Test] ✓ Senkron bekleyen: ${dirtyLists.length + dirtyTasks.length + dirtyLabels.length} kayıt`);

    // 10. Arama testi
    const searchResults = await TasksRepository.search('proje');
    console.log(`[Smoke Test] ✓ "proje" arama sonucu: ${searchResults.length} görev`);

    console.log('\n[Smoke Test] ✅ Tüm testler başarılı!');

    // Özet istatistikler
    console.log('\n📊 Veritabanı Özeti:');
    console.log(`   Listeler: ${lists.length}`);
    console.log(`   Toplam Görevler: ${await TasksRepository.count()}`);
    console.log(`   Etiketler: ${labels.length}`);
    console.log(`   Alt Görevler: ${await (SubtasksRepository as any).count()}`);
    console.log(`   Veritabanı Boyutu: ${Math.round(stats.dbSize / 1024)}KB`);

  } catch (error) {
    console.error('\n[Smoke Test] ❌ Test başarısız:', error);
    throw error;
  }
}

/**
 * Veritabanını temizle ve yeniden seed et
 */
export async function resetAndSeed(): Promise<void> {
  console.log('[Reset] Veritabanı sıfırlanıyor...');
  
  try {
    await DatabaseManager.reset();
    await seedDatabase();
    console.log('[Reset] ✅ Veritabanı sıfırlandı ve yeniden seed edildi');
  } catch (error) {
    console.error('[Reset] ❌ Reset hatası:', error);
    throw error;
  }
}

/**
 * Development helper - hızlı test için
 */
export async function quickTest(): Promise<void> {
  try {
    console.log('🚀 Hızlı Test Başlıyor...\n');
    
    await DatabaseManager.init();
    await seedDatabase();
    await smokeTest();
    
    console.log('\n🎉 Hızlı test tamamlandı!');
  } catch (error) {
    console.error('\n💥 Hızlı test hatası:', error);
  }
}
