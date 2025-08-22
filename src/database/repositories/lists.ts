/**
 * Lists repository - Liste yönetimi
 */

import { DatabaseManager } from '../db';
import { List } from '../types';
import { generateId, now } from '../id';

export class ListsRepository {
  
  /**
   * Yeni liste oluştur
   */
  static async create(data: {
    name: string;
    color?: string | null;
  }): Promise<List> {
    const id = generateId();
    const timestamp = now();

    const sql = `
      INSERT INTO lists (
        id, name, color, created_at, updated_at, version, dirty
      ) VALUES (?, ?, ?, ?, ?, 0, 1)
    `;

    try {
      await DatabaseManager.execute(sql, [
        id,
        data.name,
        data.color || null,
        timestamp,
        timestamp
      ]);

      return (await this.getById(id))!;
    } catch (error) {
      throw new Error(`Liste oluşturma hatası: ${error}`);
    }
  }

  /**
   * Liste güncelle
   */
  static async update(id: string, data: {
    name?: string;
    color?: string | null;
  }): Promise<List | null> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Liste bulunamadı: ${id}`);
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      params.push(data.name);
    }

    if (data.color !== undefined) {
      updates.push('color = ?');
      params.push(data.color);
    }

    if (updates.length === 0) {
      return existing;
    }

    // updated_at, version, dirty otomatik trigger'larla güncellenecek
    updates.push('updated_at = ?');
    params.push(now());
    params.push(id);

    const sql = `UPDATE lists SET ${updates.join(', ')} WHERE id = ?`;

    try {
      const affectedRows = await DatabaseManager.modify(sql, params);
      if (affectedRows === 0) {
        throw new Error(`Liste güncellenemedi: ${id}`);
      }

      return await this.getById(id);
    } catch (error) {
      throw new Error(`Liste güncelleme hatası: ${error}`);
    }
  }

  /**
   * Liste soft delete
   */
  static async delete(id: string): Promise<boolean> {
    const sql = `
      UPDATE lists 
      SET deleted_at = ?, dirty = 1, version = version + 1
      WHERE id = ? AND deleted_at IS NULL
    `;

    try {
      const affectedRows = await DatabaseManager.modify(sql, [now(), id]);
      return affectedRows > 0;
    } catch (error) {
      throw new Error(`Liste silme hatası: ${error}`);
    }
  }

  /**
   * Silinen listeyi geri yükle
   */
  static async restore(id: string): Promise<boolean> {
    const sql = `
      UPDATE lists 
      SET deleted_at = NULL, dirty = 1, version = version + 1
      WHERE id = ? AND deleted_at IS NOT NULL
    `;

    try {
      const affectedRows = await DatabaseManager.modify(sql, [id]);
      return affectedRows > 0;
    } catch (error) {
      throw new Error(`Liste geri yükleme hatası: ${error}`);
    }
  }

  /**
   * Liste hard delete (kalıcı silme)
   */
  static async hardDelete(id: string): Promise<boolean> {
    const sql = 'DELETE FROM lists WHERE id = ?';

    try {
      const affectedRows = await DatabaseManager.modify(sql, [id]);
      return affectedRows > 0;
    } catch (error) {
      throw new Error(`Liste kalıcı silme hatası: ${error}`);
    }
  }

  /**
   * ID ile liste getir
   */
  static async getById(id: string): Promise<List | null> {
    const sql = 'SELECT * FROM lists WHERE id = ? AND deleted_at IS NULL';
    
    try {
      return await DatabaseManager.queryFirst<List>(sql, [id]);
    } catch (error) {
      throw new Error(`Liste getirme hatası: ${error}`);
    }
  }

  /**
   * Tüm listeleri getir (silinen hariç)
   */
  static async getAll(includeDeleted: boolean = false): Promise<List[]> {
    const whereClause = includeDeleted ? '' : 'WHERE deleted_at IS NULL';
    const sql = `
      SELECT * FROM lists 
      ${whereClause}
      ORDER BY created_at DESC
    `;

    try {
      return await DatabaseManager.queryAll<List>(sql);
    } catch (error) {
      throw new Error(`Listeler getirme hatası: ${error}`);
    }
  }

  /**
   * Liste görev sayısı ile birlikte getir
   */
  static async getAllWithTaskCounts(): Promise<Array<List & { task_count: number; completed_count: number }>> {
    const sql = `
      SELECT 
        l.*,
        COALESCE(t.task_count, 0) as task_count,
        COALESCE(t.completed_count, 0) as completed_count
      FROM lists l
      LEFT JOIN (
        SELECT 
          list_id,
          COUNT(*) as task_count,
          COUNT(CASE WHEN status = 'done' THEN 1 END) as completed_count
        FROM tasks 
        WHERE deleted_at IS NULL
        GROUP BY list_id
      ) t ON l.id = t.list_id
      WHERE l.deleted_at IS NULL
      ORDER BY l.created_at DESC
    `;

    try {
      return await DatabaseManager.queryAll(sql);
    } catch (error) {
      throw new Error(`Listeler görev sayısı ile getirme hatası: ${error}`);
    }
  }

  /**
   * İsme göre liste ara
   */
  static async searchByName(query: string): Promise<List[]> {
    const sql = `
      SELECT * FROM lists 
      WHERE name LIKE ? AND deleted_at IS NULL
      ORDER BY name
    `;

    try {
      return await DatabaseManager.queryAll<List>(sql, [`%${query}%`]);
    } catch (error) {
      throw new Error(`Liste arama hatası: ${error}`);
    }
  }

  /**
   * Kirli (senkron bekleyen) listeleri getir
   */
  static async getDirty(): Promise<List[]> {
    const sql = `
      SELECT * FROM lists 
      WHERE dirty = 1
      ORDER BY updated_at ASC
    `;

    try {
      return await DatabaseManager.queryAll<List>(sql);
    } catch (error) {
      throw new Error(`Kirli listeler getirme hatası: ${error}`);
    }
  }

  /**
   * Liste temizle (senkron sonrası)
   */
  static async markClean(id: string, version?: number): Promise<boolean> {
    const updates = ['dirty = 0'];
    const params = [id];

    if (version !== undefined) {
      updates.push('version = ?');
      params.unshift(version.toString());
    }

    const sql = `UPDATE lists SET ${updates.join(', ')} WHERE id = ?`;

    try {
      const affectedRows = await DatabaseManager.modify(sql, params);
      return affectedRows > 0;
    } catch (error) {
      throw new Error(`Liste temizleme hatası: ${error}`);
    }
  }

  /**
   * Toplam liste sayısı
   */
  static async count(includeDeleted: boolean = false): Promise<number> {
    const whereClause = includeDeleted ? '' : 'WHERE deleted_at IS NULL';
    const sql = `SELECT COUNT(*) as count FROM lists ${whereClause}`;

    try {
      const result = await DatabaseManager.queryFirst<{ count: number }>(sql);
      return result?.count || 0;
    } catch (error) {
      throw new Error(`Liste sayısı getirme hatası: ${error}`);
    }
  }
}
