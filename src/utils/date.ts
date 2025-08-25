/**
 * Tarih utility fonksiyonları
 */

/**
 * Şu anki timestamp (milisaniye)
 */
export function now(): number {
  return Date.now();
}

/**
 * Bugünün başlangıcı (00:00:00)
 */
export function startOfToday(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
}

/**
 * Bugünün sonu (23:59:59.999)
 */
export function endOfToday(): number {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today.getTime();
}

/**
 * YYYY-MM-DD formatındaki string'i epoch'a çevir
 */
export function parseDateYYYYMMDD(dateStr: string): number | null {
  if (!dateStr) return null;
  
  // YYYY-MM-DD formatını kontrol et
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return null;
  
  const date = new Date(dateStr + 'T00:00:00.000Z');
  
  // Geçerli tarih kontrolü
  if (isNaN(date.getTime())) return null;
  
  return date.getTime();
}

/**
 * Epoch'u YYYY-MM-DD formatına çevir
 */
export function formatDateYYYYMMDD(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Due date'i kullanıcı dostu formata çevir
 */
export function formatDue(timestamp: number): string {
  const dueDate = new Date(timestamp);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  // Bugün mü?
  if (isSameDay(dueDate, today)) {
    return 'Bugün';
  }
  
  // Yarın mı?
  if (isSameDay(dueDate, tomorrow)) {
    return 'Yarın';
  }
  
  // Dün mü?
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (isSameDay(dueDate, yesterday)) {
    return 'Dün';
  }
  
  // Bu hafta içinde mi?
  const daysDiff = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff >= 2 && daysDiff <= 6) {
    return dueDate.toLocaleDateString('tr-TR', { weekday: 'long' });
  }
  
  if (daysDiff <= -2 && daysDiff >= -6) {
    return dueDate.toLocaleDateString('tr-TR', { weekday: 'long' }) + ' (geçmiş)';
  }
  
  // Standart format: dd.mm
  const day = dueDate.getDate().toString().padStart(2, '0');
  const month = (dueDate.getMonth() + 1).toString().padStart(2, '0');
  
  // Bu yıl değilse yılı da ekle
  if (dueDate.getFullYear() !== today.getFullYear()) {
    return `${day}.${month}.${dueDate.getFullYear()}`;
  }
  
  return `${day}.${month}`;
}

/**
 * İki tarihin aynı gün olup olmadığını kontrol et
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Tarihin bugün olup olmadığını kontrol et
 */
export function isToday(timestamp: number): boolean {
  const date = new Date(timestamp);
  const today = new Date();
  return isSameDay(date, today);
}

/**
 * Tarihin yarın olup olmadığını kontrol et
 */
export function isTomorrow(timestamp: number): boolean {
  const date = new Date(timestamp);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isSameDay(date, tomorrow);
}

/**
 * Tarihin vadesi geçip geçmediğini kontrol et
 */
export function isOverdue(timestamp: number): boolean {
  return timestamp < now();
}

/**
 * Gelecek hafta sonu (Pazar gecesi)
 */
export function endOfWeek(): number {
  const today = new Date();
  const daysUntilSunday = 7 - today.getDay(); // 0=Pazar, 1=Pazartesi, ...
  const sunday = new Date(today);
  sunday.setDate(today.getDate() + daysUntilSunday);
  sunday.setHours(23, 59, 59, 999);
  return sunday.getTime();
}

/**
 * Geçen hafta başı (Pazartesi sabahı)
 */
export function startOfWeek(): number {
  const today = new Date();
  const daysSinceMonday = today.getDay() === 0 ? 6 : today.getDay() - 1; // Pazartesi=0 yapmak için
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysSinceMonday);
  monday.setHours(0, 0, 0, 0);
  return monday.getTime();
}

/**
 * X gün sonrasını hesapla
 */
export function addDays(days: number, fromDate?: number): number {
  const date = fromDate ? new Date(fromDate) : new Date();
  date.setDate(date.getDate() + days);
  return date.getTime();
}

/**
 * Zaman farkını insan okunabilir formatta döndür
 */
export function timeAgo(timestamp: number): string {
  const diff = now() - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return 'Az önce';
  if (minutes < 60) return `${minutes} dakika önce`;
  if (hours < 24) return `${hours} saat önce`;
  if (days < 7) return `${days} gün önce`;
  
  return formatDue(timestamp);
}
