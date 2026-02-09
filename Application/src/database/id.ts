/**
 * UUID ve tarih yardımcı fonksiyonları
 */

import { Timestamp } from './types';

/**
 * RFC4122 v4 UUID üretici
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Şu anki zaman damgası (milisaniye)
 */
export function now(): Timestamp {
  return Date.now();
}

/**
 * Tarih nesnesini timestamp'e çevir
 */
export function dateToTimestamp(date: Date): Timestamp {
  return date.getTime();
}

/**
 * Timestamp'i tarih nesnesine çevir
 */
export function timestampToDate(timestamp: Timestamp): Date {
  return new Date(timestamp);
}

/**
 * Bugünün başlangıcı (00:00:00)
 */
export function startOfDay(date?: Date): Timestamp {
  const d = date || new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/**
 * Bugünün sonu (23:59:59.999)
 */
export function endOfDay(date?: Date): Timestamp {
  const d = date || new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

/**
 * X gün sonrasının timestamp'i
 */
export function addDays(days: number, from?: Timestamp): Timestamp {
  const date = from ? new Date(from) : new Date();
  date.setDate(date.getDate() + days);
  return date.getTime();
}
