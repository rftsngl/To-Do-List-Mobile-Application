/**
 * Veritabanı bağlantı ve yönetim modülü
 */

import SQLite from 'react-native-sqlite-storage';
import { runMigrations } from './migrations';

export class DatabaseManager {
  private static instance: SQLite.SQLiteDatabase | null = null;
  private static readonly DB_NAME = 'todoapp.db';

  /**
   * Veritabanını başlat
   */
  static async init(): Promise<SQLite.SQLiteDatabase> {
    if (this.instance) {
      return this.instance;
    }

    try {
      console.log('[DB] Veritabanı açılmaya çalışılıyor:', this.DB_NAME);
      
      // SQLite Storage API
      SQLite.DEBUG(true);
      SQLite.enablePromise(true);
      
      this.instance = await SQLite.openDatabase({
        name: this.DB_NAME,
        location: 'default'
      });
      
      console.log('[DB] Veritabanı başarıyla açıldı');

      // Foreign key'leri etkinleştir
      await this.instance.executeSql('PRAGMA foreign_keys = ON;');
      
      // WAL modunu etkinleştir (performans için)
      await this.instance.executeSql('PRAGMA journal_mode = WAL;');
      
      // Migration'ları çalıştır
      await runMigrations(this.instance);

      return this.instance;
    } catch (error) {
      console.error('[DB] Veritabanı başlatma hatası:', error);
      throw new Error(`Veritabanı başlatılamadı: ${error}`);
    }
  }

  /**
   * Veritabanı bağlantısını al
   */
  static getDB(): SQLite.SQLiteDatabase {
    if (!this.instance) {
      throw new Error('Veritabanı henüz başlatılmadı. Önce DatabaseManager.init() çağırın.');
    }
    return this.instance;
  }

  /**
   * Veritabanını kapat
   */
  static async close(): Promise<void> {
    if (this.instance) {
      await this.instance.close();
      this.instance = null;
      console.log('[DB] Veritabanı kapatıldı');
    }
  }

  /**
   * Transaction yardımcısı
   */
  static async transaction<T>(fn: (db: SQLite.SQLiteDatabase) => Promise<T>): Promise<T> {
    const db = this.getDB();
    
    try {
      await db.executeSql('BEGIN;');
      const result = await fn(db);
      await db.executeSql('COMMIT;');
      return result;
    } catch (error) {
      try {
        await db.executeSql('ROLLBACK;');
      } catch (rollbackError) {
        console.error('[DB] Rollback hatası:', rollbackError);
      }
      console.error('[DB] Transaction hatası:', error);
      throw error;
    }
  }

  /**
   * Güvenli sorgu çalıştırıcı
   */
  static async execute(sql: string, params: any[] = []): Promise<SQLite.ResultSet> {
    try {
      const db = this.getDB();
      const [result] = await db.executeSql(sql, params);
      return result;
    } catch (error) {
      console.error('[DB] Sorgu hatası:', { sql, params, error });
      throw new Error(`SQL hatası: ${error}`);
    }
  }

  /**
   * Tek bir sonuç döndüren sorgu
   */
  static async queryFirst<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const result = await this.execute(sql, params);
    if (result.rows.length > 0) {
      return result.rows.item(0);
    }
    return null;
  }

  /**
   * Tüm sonuçları döndüren sorgu
   */
  static async queryAll<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const result = await this.execute(sql, params);
    const rows: T[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      rows.push(result.rows.item(i));
    }
    return rows;
  }

  /**
   * INSERT sorgusu çalıştır ve insertedRowId döndür
   */
  static async insert(sql: string, params: any[] = []): Promise<number> {
    const result = await this.execute(sql, params);
    if (result.insertId === undefined) {
      throw new Error('INSERT işlemi başarısız: insertId döndürülmedi');
    }
    return result.insertId;
  }

  /**
   * UPDATE/DELETE sorgusu çalıştır ve etkilenen satır sayısını döndür
   */
  static async modify(sql: string, params: any[] = []): Promise<number> {
    const result = await this.execute(sql, params);
    return result.rowsAffected || 0;
  }

  /**
   * Veritabanı istatistikleri
   */
  static async getStats(): Promise<{
    tables: string[];
    dbSize: number;
    version: number;
  }> {
    const db = this.getDB();
    
    // Tablo listesi
    const tablesResult = await db.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
    );
    const tables: string[] = [];
    for (let i = 0; i < tablesResult[0].rows.length; i++) {
      tables.push(tablesResult[0].rows.item(i).name);
    }

    // Veritabanı boyutu (sayfa sayısı × sayfa boyutu)
    const pageSizeResult = await db.executeSql('PRAGMA page_size;');
    const pageCountResult = await db.executeSql('PRAGMA page_count;');
    const pageSize = pageSizeResult[0].rows.item(0)?.page_size || 0;
    const pageCount = pageCountResult[0].rows.item(0)?.page_count || 0;
    const dbSize = pageSize * pageCount;

    // Schema versiyonu
    try {
      const versionResult = await db.executeSql('SELECT MAX(version) as version FROM schema_migrations;');
      const version = versionResult[0].rows.item(0)?.version || 0;
      return { tables, dbSize, version };
    } catch {
      return { tables, dbSize, version: 0 };
    }
  }

  /**
   * Veritabanını temizle (geliştirme için)
   */
  static async reset(): Promise<void> {
    const db = this.getDB();
    
    // Tüm tabloları sil
    const tablesResult = await db.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
    );
    
    const tables: string[] = [];
    for (let i = 0; i < tablesResult[0].rows.length; i++) {
      tables.push(tablesResult[0].rows.item(i).name);
    }

    await db.executeSql('PRAGMA foreign_keys = OFF;');
    
    for (const tableName of tables) {
      await db.executeSql(`DROP TABLE IF EXISTS ${tableName};`);
    }

    await db.executeSql('PRAGMA foreign_keys = ON;');

    // Migration'ları yeniden çalıştır
    await runMigrations(db);
    
    console.log('[DB] Veritabanı sıfırlandı ve yeniden oluşturuldu');
  }
}
