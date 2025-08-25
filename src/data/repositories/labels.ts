/**
 * Labels repository - Etiket yönetimi
 */

import { DatabaseManager } from '../db';
import { Label, TaskLabel } from '../types';
import { generateId, now } from '../id';

export class LabelsRepository {
  
  /**
   * Yeni etiket oluştur
   */
  static async create(data: {
    name: string;
    color?: string | null;
  }): Promise<Label> {
    const id = generateId();
    const timestamp = now();

    const sql = `
      INSERT INTO labels (
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
    } catch (error: any) {
      if (error.toString().includes('UNIQUE constraint failed')) {
        throw new Error(`Bu etiket adı zaten mevcut: ${data.name}`);
      }
      throw new Error(`Etiket oluşturma hatası: ${error}`);
    }
  }

  /**
   * Etiket güncelle
   */
  static async update(id: string, data: {
    name?: string;
    color?: string | null;
  }): Promise<Label | null> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Etiket bulunamadı: ${id}`);
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

    updates.push('updated_at = ?');
    params.push(now());
    params.push(id);

    const sql = `UPDATE labels SET ${updates.join(', ')} WHERE id = ?`;

    try {
      const affectedRows = await DatabaseManager.modify(sql, params);
      if (affectedRows === 0) {
        throw new Error(`Etiket güncellenemedi: ${id}`);
      }

      return await this.getById(id);
    } catch (error: any) {
      if (error.toString().includes('UNIQUE constraint failed')) {
        throw new Error(`Bu etiket adı zaten mevcut: ${data.name}`);
      }
      throw new Error(`Etiket güncelleme hatası: ${error}`);
    }
  }

  /**
   * Etiket soft delete
   */
  static async delete(id: string): Promise<boolean> {
    const sql = `
      UPDATE labels 
      SET deleted_at = ?, dirty = 1, version = version + 1
      WHERE id = ? AND deleted_at IS NULL
    `;

    try {
      const affectedRows = await DatabaseManager.modify(sql, [now(), id]);
      return affectedRows > 0;
    } catch (error) {
      throw new Error(`Etiket silme hatası: ${error}`);
    }
  }

  /**
   * Etiketi geri yükle
   */
  static async restore(id: string): Promise<boolean> {
    const sql = `
      UPDATE labels 
      SET deleted_at = NULL, dirty = 1, version = version + 1
      WHERE id = ? AND deleted_at IS NOT NULL
    `;

    try {
      const affectedRows = await DatabaseManager.modify(sql, [id]);
      return affectedRows > 0;
    } catch (error) {
      throw new Error(`Etiket geri yükleme hatası: ${error}`);
    }
  }

  /**
   * Etiket hard delete (kalıcı silme)
   */
  static async hardDelete(id: string): Promise<boolean> {
    return await DatabaseManager.transaction(async () => {
      // Önce görev-etiket ilişkilerini sil
      await DatabaseManager.execute('DELETE FROM task_labels WHERE label_id = ?', [id]);
      
      // Sonra etiketi sil
      const affectedRows = await DatabaseManager.modify('DELETE FROM labels WHERE id = ?', [id]);
      return affectedRows > 0;
    });
  }

  /**
   * ID ile etiket getir
   */
  static async getById(id: string): Promise<Label | null> {
    const sql = 'SELECT * FROM labels WHERE id = ? AND deleted_at IS NULL';
    
    try {
      return await DatabaseManager.queryFirst<Label>(sql, [id]);
    } catch (error) {
      throw new Error(`Etiket getirme hatası: ${error}`);
    }
  }

  /**
   * İsme göre etiket getir
   */
  static async getByName(name: string): Promise<Label | null> {
    const sql = 'SELECT * FROM labels WHERE name = ? AND deleted_at IS NULL';
    
    try {
      return await DatabaseManager.queryFirst<Label>(sql, [name]);
    } catch (error) {
      throw new Error(`Etiket getirme hatası: ${error}`);
    }
  }

  /**
   * Tüm etiketleri getir
   */
  static async getAll(includeDeleted: boolean = false): Promise<Label[]> {
    const whereClause = includeDeleted ? '' : 'WHERE deleted_at IS NULL';
    const sql = `
      SELECT * FROM labels 
      ${whereClause}
      ORDER BY name
    `;

    try {
      return await DatabaseManager.queryAll<Label>(sql);
    } catch (error) {
      throw new Error(`Etiketler getirme hatası: ${error}`);
    }
  }

  /**
   * Etiketleri görev sayısı ile birlikte getir
   */
  static async getAllWithTaskCounts(): Promise<Array<Label & { task_count: number }>> {
    const sql = `
      SELECT 
        l.*,
        COALESCE(t.task_count, 0) as task_count
      FROM labels l
      LEFT JOIN (
        SELECT 
          tl.label_id,
          COUNT(*) as task_count
        FROM task_labels tl
        INNER JOIN tasks t ON tl.task_id = t.id
        WHERE t.deleted_at IS NULL
        GROUP BY tl.label_id
      ) t ON l.id = t.label_id
      WHERE l.deleted_at IS NULL
      ORDER BY l.name
    `;

    try {
      return await DatabaseManager.queryAll(sql);
    } catch (error) {
      throw new Error(`Etiketler görev sayısı ile getirme hatası: ${error}`);
    }
  }

  /**
   * İsme göre etiket ara
   */
  static async searchByName(query: string): Promise<Label[]> {
    const sql = `
      SELECT * FROM labels 
      WHERE name LIKE ? AND deleted_at IS NULL
      ORDER BY name
    `;

    try {
      return await DatabaseManager.queryAll<Label>(sql, [`%${query}%`]);
    } catch (error) {
      throw new Error(`Etiket arama hatası: ${error}`);
    }
  }

  /**
   * Görevin etiketlerini getir
   */
  static async getByTask(taskId: string): Promise<Label[]> {
    const sql = `
      SELECT l.* FROM labels l
      INNER JOIN task_labels tl ON l.id = tl.label_id
      WHERE tl.task_id = ? AND l.deleted_at IS NULL
      ORDER BY l.name
    `;

    try {
      return await DatabaseManager.queryAll<Label>(sql, [taskId]);
    } catch (error) {
      throw new Error(`Görev etiketleri getirme hatası: ${error}`);
    }
  }

  /**
   * Göreve etiket ekle
   */
  static async addToTask(taskId: string, labelId: string): Promise<boolean> {
    // Önce görev ve etiketin var olduğunu kontrol et
    const taskExists = await DatabaseManager.queryFirst(
      'SELECT id FROM tasks WHERE id = ? AND deleted_at IS NULL', 
      [taskId]
    );
    if (!taskExists) {
      throw new Error(`Görev bulunamadı: ${taskId}`);
    }

    const labelExists = await this.getById(labelId);
    if (!labelExists) {
      throw new Error(`Etiket bulunamadı: ${labelId}`);
    }

    const sql = `
      INSERT OR IGNORE INTO task_labels (task_id, label_id)
      VALUES (?, ?)
    `;

    try {
      const result = await DatabaseManager.execute(sql, [taskId, labelId]);
      return result.rowsAffected > 0;
    } catch (error) {
      throw new Error(`Göreve etiket ekleme hatası: ${error}`);
    }
  }

  /**
   * Görevden etiket kaldır
   */
  static async removeFromTask(taskId: string, labelId: string): Promise<boolean> {
    const sql = 'DELETE FROM task_labels WHERE task_id = ? AND label_id = ?';

    try {
      const affectedRows = await DatabaseManager.modify(sql, [taskId, labelId]);
      return affectedRows > 0;
    } catch (error) {
      throw new Error(`Görevden etiket kaldırma hatası: ${error}`);
    }
  }

  /**
   * Görevin tüm etiketlerini değiştir
   */
  static async setTaskLabels(taskId: string, labelIds: string[]): Promise<boolean> {
    return await DatabaseManager.transaction(async () => {
      // Önce mevcut etiketleri sil
      await DatabaseManager.execute('DELETE FROM task_labels WHERE task_id = ?', [taskId]);

      // Yeni etiketleri ekle
      for (const labelId of labelIds) {
        const labelExists = await this.getById(labelId);
        if (!labelExists) {
          throw new Error(`Etiket bulunamadı: ${labelId}`);
        }

        await DatabaseManager.execute(
          'INSERT INTO task_labels (task_id, label_id) VALUES (?, ?)',
          [taskId, labelId]
        );
      }

      return true;
    });
  }

  /**
   * Kullanılmayan etiketleri getir
   */
  static async getUnused(): Promise<Label[]> {
    const sql = `
      SELECT l.* FROM labels l
      LEFT JOIN task_labels tl ON l.id = tl.label_id
      WHERE tl.label_id IS NULL AND l.deleted_at IS NULL
      ORDER BY l.name
    `;

    try {
      return await DatabaseManager.queryAll<Label>(sql);
    } catch (error) {
      throw new Error(`Kullanılmayan etiketler getirme hatası: ${error}`);
    }
  }

  /**
   * Kirli (senkron bekleyen) etiketleri getir
   */
  static async getDirty(): Promise<Label[]> {
    const sql = `
      SELECT * FROM labels 
      WHERE dirty = 1
      ORDER BY updated_at ASC
    `;

    try {
      return await DatabaseManager.queryAll<Label>(sql);
    } catch (error) {
      throw new Error(`Kirli etiketler getirme hatası: ${error}`);
    }
  }

  /**
   * Etiket temizle (senkron sonrası)
   */
  static async markClean(id: string, version?: number): Promise<boolean> {
    const updates = ['dirty = 0'];
    const params = [id];

    if (version !== undefined) {
      updates.push('version = ?');
      params.unshift(version.toString());
    }

    const sql = `UPDATE labels SET ${updates.join(', ')} WHERE id = ?`;

    try {
      const affectedRows = await DatabaseManager.modify(sql, params);
      return affectedRows > 0;
    } catch (error) {
      throw new Error(`Etiket temizleme hatası: ${error}`);
    }
  }

  /**
   * Toplam etiket sayısı
   */
  static async count(includeDeleted: boolean = false): Promise<number> {
    const whereClause = includeDeleted ? '' : 'WHERE deleted_at IS NULL';
    const sql = `SELECT COUNT(*) as count FROM labels ${whereClause}`;

    try {
      const result = await DatabaseManager.queryFirst<{ count: number }>(sql);
      return result?.count || 0;
    } catch (error) {
      throw new Error(`Etiket sayısı getirme hatası: ${error}`);
    }
  }

  /**
   * Popüler etiketleri getir (en çok kullanılan)
   */
  static async getPopular(limit: number = 10): Promise<Array<Label & { task_count: number }>> {
    const sql = `
      SELECT 
        l.*,
        COUNT(tl.task_id) as task_count
      FROM labels l
      INNER JOIN task_labels tl ON l.id = tl.label_id
      INNER JOIN tasks t ON tl.task_id = t.id
      WHERE l.deleted_at IS NULL AND t.deleted_at IS NULL
      GROUP BY l.id
      ORDER BY task_count DESC, l.name
      LIMIT ?
    `;

    try {
      return await DatabaseManager.queryAll(sql, [limit]);
    } catch (error) {
      throw new Error(`Popüler etiketler getirme hatası: ${error}`);
    }
  }

  /**
   * Alias metodları - UI için daha uygun isimler
   */
  static async link(taskId: string, labelId: string): Promise<boolean> {
    return await this.addToTask(taskId, labelId);
  }

  static async unlink(taskId: string, labelId: string): Promise<boolean> {
    return await this.removeFromTask(taskId, labelId);
  }

  static async setForTask(taskId: string, labelIds: string[]): Promise<boolean> {
    return await this.setTaskLabels(taskId, labelIds);
  }
}
