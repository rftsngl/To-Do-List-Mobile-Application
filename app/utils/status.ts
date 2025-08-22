/**
 * Status utility fonksiyonları
 */

export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';

/**
 * Status sıralaması için sayısal değer döndür
 * 0: todo (en üstte)
 * 1: in_progress
 * 2: blocked  
 * 3: done (en altta)
 */
export function statusOrder(status: TaskStatus): number {
  switch (status) {
    case 'todo': return 0;
    case 'in_progress': return 1;
    case 'blocked': return 2;
    case 'done': return 3;
    default: return 0;
  }
}

/**
 * Status'u kullanıcı dostu Türkçe metne çevir
 */
export function getStatusLabel(status: TaskStatus): string {
  switch (status) {
    case 'todo': return 'Yapılacak';
    case 'in_progress': return 'Devam Ediyor';
    case 'blocked': return 'Engellendi';
    case 'done': return 'Tamamlandı';
    default: return 'Yapılacak';
  }
}

/**
 * Tüm status seçeneklerini döndür
 */
export function getAllStatuses(): { value: TaskStatus; label: string }[] {
  return [
    { value: 'todo', label: 'Yapılacak' },
    { value: 'in_progress', label: 'Devam Ediyor' },
    { value: 'blocked', label: 'Engellendi' },
    { value: 'done', label: 'Tamamlandı' },
  ];
}

/**
 * Status'un aktif (tamamlanmamış) olup olmadığını kontrol et
 */
export function isActiveStatus(status: TaskStatus): boolean {
  return status !== 'done';
}

/**
 * Status'un tamamlanmış olup olmadığını kontrol et
 */
export function isCompletedStatus(status: TaskStatus): boolean {
  return status === 'done';
}

/**
 * Priority seviyesini kullanıcı dostu metne çevir
 */
export function getPriorityLabel(priority: number): string {
  switch (priority) {
    case 0: return 'Düşük';
    case 1: return 'Normal';
    case 2: return 'Yüksek';
    case 3: return 'Kritik';
    default: return 'Normal';
  }
}

/**
 * Tüm priority seçeneklerini döndür
 */
export function getAllPriorities(): { value: number; label: string }[] {
  return [
    { value: 0, label: 'Düşük' },
    { value: 1, label: 'Normal' },
    { value: 2, label: 'Yüksek' },
    { value: 3, label: 'Kritik' },
  ];
}

/**
 * Priority'yi emoji ile göster
 */
export function getPriorityEmoji(priority: number): string {
  switch (priority) {
    case 0: return '🟢';
    case 1: return '🔵';
    case 2: return '🟡';
    case 3: return '🔴';
    default: return '🔵';
  }
}

/**
 * Status'u emoji ile göster
 */
export function getStatusEmoji(status: TaskStatus): string {
  switch (status) {
    case 'todo': return '⚪';
    case 'in_progress': return '🟡';
    case 'blocked': return '🔴';
    case 'done': return '✅';
    default: return '⚪';
  }
}
