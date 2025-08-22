/**
 * Subtasks repository - Alt görev yönetimi
 */

import { DatabaseManager } from '../db';
import { Subtask } from '../types';
import { generateId, now } from '../id';

export class SubtasksRepository {

  /**
   * Yeni alt görev oluştur
   */
  static async create(data: {
    task_id: string;
    title: string;
    done?: number;
    sort_order?: number | null;
  }): Promise<Subtask> {
    const id = generateId();
    const timestamp = now();

    // Ana görevin var olduğunu kontrol et
    const taskExists = await DatabaseManager.queryFirst(
      'SELECT id FROM tasks WHERE id = ? AND deleted_at IS NULL',
      [data.task_id]
    );
    if (!taskExists) {
      throw new Error(`Ana görev bulunamadı: ${data.task_id}`);
    }

    const sql = `
      INSERT INTO subtasks (
        id, task_id, title, done, sort_order, created_at, updated_at, version, dirty
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 1)
    `;

    try {
      await DatabaseManager.execute(sql, [
        id,
        data.task_id,
        data.title,
        data.done || 0,
        data.sort_order || null,
        timestamp,
        timestamp
      ]);

      return (await this.getById(id))!;
    } catch (error) {
      throw new Error(`Alt görev oluşturma hatası: ${error}`);
    }
  }

  /**
   * Alt görev güncelle
   */
  static async update(id: string, data: {
    title?: string;
    done?: number;
    sort_order?: number | null;
  }): Promise<Subtask | null> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Alt görev bulunamadı: ${id}`);
    }

    const updates: string[] = [];
    const params: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        params.push(value);
      }
    });

    if (updates.length === 0) {
      return existing;
    }

    updates.push('updated_at = ?');
    params.push(now());
    params.push(id);

    const sql = `UPDATE subtasks SET ${updates.join(', ')} WHERE id = ?`;

    try {
      const affectedRows = await DatabaseManager.modify(sql, params);
      if (affectedRows === 0) {
        throw new Error(`Alt görev güncellenemedi: ${id}`);
      }

      return await this.getById(id);
    } catch (error) {
      throw new Error(`Alt görev güncelleme hatası: ${error}`);
    }
  }

  /**
   * Alt görev soft delete
   */
  static async delete(id: string): Promise<boolean> {
    const sql = `
      UPDATE subtasks 
      SET deleted_at = ?, dirty = 1, version = version + 1
      WHERE id = ? AND deleted_at IS NULL
    `;

    try {
      const affectedRows = await DatabaseManager.modify(sql, [now(), id]);
      return affectedRows > 0;
    } catch (error) {
      throw new Error(`Alt görev silme hatası: ${error}`);
    }
  }

  /**
   * Alt görevi geri yükle
   */
  static async restore(id: string): Promise<boolean> {
    const sql = `
      UPDATE subtasks 
      SET deleted_at = NULL, dirty = 1, version = version + 1
      WHERE id = ? AND deleted_at IS NOT NULL
    `;

    try {
      const affectedRows = await DatabaseManager.modify(sql, [id]);
      return affectedRows > 0;
    } catch (error) {
      throw new Error(`Alt görev geri yükleme hatası: ${error}`);
    }
  }

  /**
   * Alt görev hard delete (kalıcı silme)
   */
  static async hardDelete(id: string): Promise<boolean> {
    const sql = 'DELETE FROM subtasks WHERE id = ?';

    try {
      const affectedRows = await DatabaseManager.modify(sql, [id]);
      return affectedRows > 0;
    } catch (error) {
      throw new Error(`Alt görev kalıcı silme hatası: ${error}`);
    }
  }

  /**
   * Alt görevi tamamla/tamamlanmamış işaretle
   */
  static async toggleDone(id: string): Promise<Subtask | null> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Alt görev bulunamadı: ${id}`);
    }

    const newDoneValue = existing.done === 1 ? 0 : 1;
    
    const sql = `
      UPDATE subtasks 
      SET done = ?, updated_at = ?, dirty = 1, version = version + 1
      WHERE id = ?
    `;

    try {
      const affectedRows = await DatabaseManager.modify(sql, [newDoneValue, now(), id]);
      if (affectedRows === 0) {
        throw new Error(`Alt görev güncellenemedi: ${id}`);
      }

      return await this.getById(id);
    } catch (error) {
      throw new Error(`Alt görev tamamlama hatası: ${error}`);
    }
  }

  /**
   * ID ile alt görev getir
   */
  static async getById(id: string): Promise<Subtask | null> {
    const sql = 'SELECT * FROM subtasks WHERE id = ? AND deleted_at IS NULL';
    
    try {
      return await DatabaseManager.queryFirst<Subtask>(sql, [id]);
    } catch (error) {
      throw new Error(`Alt görev getirme hatası: ${error}`);
    }
  }

  /**
   * Ana göreve göre alt görevleri getir
   */
  static async getByTask(taskId: string): Promise<Subtask[]> {
    const sql = `
      SELECT * FROM subtasks 
      WHERE task_id = ? AND deleted_at IS NULL
      ORDER BY 
        CASE WHEN sort_order IS NOT NULL THEN 0 ELSE 1 END,
        sort_order ASC,
        created_at ASC
    `;

    try {
      return await DatabaseManager.queryAll<Subtask>(sql, [taskId]);
    } catch (error) {
      throw new Error(`Görev alt görevleri getirme hatası: ${error}`);
    }
  }

  /**
   * Ana göreve göre tamamlanma durumuna göre alt görevleri getir
   */
  static async getByTaskAndStatus(taskId: string, done: number): Promise<Subtask[]> {
    const sql = `
      SELECT * FROM subtasks 
      WHERE task_id = ? AND done = ? AND deleted_at IS NULL
      ORDER BY 
        CASE WHEN sort_order IS NOT NULL THEN 0 ELSE 1 END,
        sort_order ASC,
        created_at ASC
    `;

    try {
      return await DatabaseManager.queryAll<Subtask>(sql, [taskId, done]);
    } catch (error) {
      throw new Error(`Durum alt görevleri getirme hatası: ${error}`);
    }
  }

  /**
   * Alt görev istatistikleri
   */
  static async getTaskStats(taskId: string): Promise<{
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
  }> {
    const sql = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN done = 1 THEN 1 END) as completed,
        COUNT(CASE WHEN done = 0 THEN 1 END) as pending
      FROM subtasks 
      WHERE task_id = ? AND deleted_at IS NULL
    `;

    try {
      const result = await DatabaseManager.queryFirst<{
        total: number;
        completed: number;
        pending: number;
      }>(sql, [taskId]);

      if (!result) {
        return { total: 0, completed: 0, pending: 0, completionRate: 0 };
      }

      const completionRate = result.total > 0 ? (result.completed / result.total) * 100 : 0;

      return {
        ...result,
        completionRate: Math.round(completionRate * 100) / 100 // 2 ondalık basamak
      };
    } catch (error) {
      throw new Error(`Alt görev istatistikleri getirme hatası: ${error}`);
    }
  }

  /**
   * Birden fazla alt görevi toplu güncelle
   */
  static async bulkUpdate(updates: Array<{
    id: string;
    title?: string;
    done?: number;
    sort_order?: number | null;
  }>): Promise<boolean> {
    if (updates.length === 0) return true;

    return await DatabaseManager.transaction(async () => {
      for (const update of updates) {
        const { id, ...data } = update;
        await this.update(id, data);
      }
      return true;
    });
  }

  /**
   * Alt görev sıralama güncelle
   */
  static async updateSortOrder(id: string, sortOrder: number): Promise<boolean> {
    const sql = `
      UPDATE subtasks 
      SET sort_order = ?, updated_at = ?, dirty = 1, version = version + 1
      WHERE id = ? AND deleted_at IS NULL
    `;

    try {
      const affectedRows = await DatabaseManager.modify(sql, [sortOrder, now(), id]);
      return affectedRows > 0;
    } catch (error) {
      throw new Error(`Alt görev sıralama güncelleme hatası: ${error}`);
    }
  }

  /**
   * Görevi ve tüm alt görevlerini sil
   */
  static async deleteAllByTask(taskId: string): Promise<number> {
    const sql = `
      UPDATE subtasks 
      SET deleted_at = ?, dirty = 1, version = version + 1
      WHERE task_id = ? AND deleted_at IS NULL
    `;

    try {
      return await DatabaseManager.modify(sql, [now(), taskId]);
    } catch (error) {
      throw new Error(`Görev alt görevleri silme hatası: ${error}`);
    }
  }

  /**
   * Arama
   */
  static async search(query: string, taskId?: string): Promise<Subtask[]> {
    let sql = `
      SELECT * FROM subtasks 
      WHERE title LIKE ? AND deleted_at IS NULL
    `;
    
    const params = [`%${query}%`];

    if (taskId) {
      sql += ' AND task_id = ?';
      params.push(taskId);
    }

    sql += ` ORDER BY 
      CASE WHEN sort_order IS NOT NULL THEN 0 ELSE 1 END,
      sort_order ASC,
      created_at ASC
    `;

    try {
      return await DatabaseManager.queryAll<Subtask>(sql, params);
    } catch (error) {
      throw new Error(`Alt görev arama hatası: ${error}`);
    }
  }

  /**
   * Kirli (senkron bekleyen) alt görevleri getir
   */
  static async getDirty(): Promise<Subtask[]> {
    const sql = `
      SELECT * FROM subtasks 
      WHERE dirty = 1
      ORDER BY updated_at ASC
    `;

    try {
      return await DatabaseManager.queryAll<Subtask>(sql);
    } catch (error) {
      throw new Error(`Kirli alt görevler getirme hatası: ${error}`);
    }
  }

  /**
   * Alt görev temizle (senkron sonrası)
   */
  static async markClean(id: string, version?: number): Promise<boolean> {
    const updates = ['dirty = 0'];
    const params = [id];

    if (version !== undefined) {
      updates.push('version = ?');
      params.unshift(version.toString());
    }

    const sql = `UPDATE subtasks SET ${updates.join(', ')} WHERE id = ?`;

    try {
      const affectedRows = await DatabaseManager.modify(sql, params);
      return affectedRows > 0;
    } catch (error) {
      throw new Error(`Alt görev temizleme hatası: ${error}`);
    }
  }

  /**
   * Toplam alt görev sayısı
   */
  static async count(taskId?: string): Promise<number> {
    let sql = 'SELECT COUNT(*) as count FROM subtasks WHERE deleted_at IS NULL';
    const params: any[] = [];

    if (taskId) {
      sql += ' AND task_id = ?';
      params.push(taskId);
    }

    try {
      const result = await DatabaseManager.queryFirst<{ count: number }>(sql, params);
      return result?.count || 0;
    } catch (error) {
      throw new Error(`Alt görev sayısı getirme hatası: ${error}`);
    }
  }

  /**
   * Tamamlanmamış alt görevleri getir
   */
  static async getPending(taskId?: string): Promise<Subtask[]> {
    let sql = `
      SELECT * FROM subtasks 
      WHERE done = 0 AND deleted_at IS NULL
    `;
    const params: any[] = [];

    if (taskId) {
      sql += ' AND task_id = ?';
      params.push(taskId);
    }

    sql += ` ORDER BY 
      CASE WHEN sort_order IS NOT NULL THEN 0 ELSE 1 END,
      sort_order ASC,
      created_at ASC
    `;

    try {
      return await DatabaseManager.queryAll<Subtask>(sql, params);
    } catch (error) {
      throw new Error(`Bekleyen alt görevler getirme hatası: ${error}`);
    }
  }

  // ========== UI ENTEGRASYON FONKSİYONLARI ==========
  // Kullanıcı tarafından talep edilen API ile uyumluluk için wrapper fonksiyonlar

  /**
   * Ana göreve göre alt görevleri listele (UI için)
   */
  static async listByTask(taskId: string): Promise<Subtask[]> {
    const sql = `
      SELECT * FROM subtasks 
      WHERE task_id = ? AND deleted_at IS NULL
      ORDER BY 
        CASE WHEN sort_order IS NOT NULL THEN 0 ELSE 1 END,
        sort_order ASC NULLS LAST,
        updated_at DESC
    `;

    try {
      return await DatabaseManager.queryAll<Subtask>(sql, [taskId]);
    } catch (error) {
      throw new Error(`Alt görev listesi getirme hatası: ${error}`);
    }
  }

  /**
   * Yeni alt görev ekle (UI için)
   */
  static async add(taskId: string, title: string): Promise<Subtask> {
    // Mevcut sort_order'ların maksimumunu bul ve 1 ekle
    const maxSortOrderResult = await DatabaseManager.queryFirst<{ max_sort: number | null }>(
      'SELECT MAX(sort_order) as max_sort FROM subtasks WHERE task_id = ? AND deleted_at IS NULL',
      [taskId]
    );
    
    const nextSortOrder = maxSortOrderResult?.max_sort ? maxSortOrderResult.max_sort + 1 : 1;

    return await this.create({
      task_id: taskId,
      title,
      sort_order: nextSortOrder
    });
  }

  /**
   * Alt görev yeniden adlandır (UI için)
   */
  static async rename(id: string, title: string): Promise<void> {
    const result = await this.update(id, { title });
    if (!result) {
      throw new Error(`Alt görev yeniden adlandırılamadı: ${id}`);
    }
  }

  /**
   * Alt görev kaldır (UI için)
   */
  static async remove(id: string): Promise<void> {
    const success = await this.delete(id);
    if (!success) {
      throw new Error(`Alt görev kaldırılamadı: ${id}`);
    }
  }

  /**
   * Alt görev istatistikleri (UI için basitleştirilmiş)
   */
  static async getStats(taskId: string): Promise<{ total: number; done: number }> {
    const stats = await this.getTaskStats(taskId);
    return {
      total: stats.total,
      done: stats.completed
    };
  }

  /**
   * Alt görev sıralama hareketi (UI için)
   * Fractional ordering yaklaşımı ile güvenli sıralama
   */
  static async move(opts: { 
    subtaskId: string, 
    beforeId?: string | null, 
    afterId?: string | null 
  }): Promise<void> {
    const { subtaskId, beforeId, afterId } = opts;

    return await DatabaseManager.transaction(async () => {
      // Taşınan alt görevi al
      const movingSubtask = await this.getById(subtaskId);
      if (!movingSubtask) {
        throw new Error(`Taşınan alt görev bulunamadı: ${subtaskId}`);
      }

      let newSortOrder: number;

      if (beforeId && afterId) {
        // İki alt görev arasına yerleştir
        const beforeSubtask = await this.getById(beforeId);
        const afterSubtask = await this.getById(afterId);
        
        if (!beforeSubtask || !afterSubtask) {
          throw new Error('Referans alt görevler bulunamadı');
        }

        const beforeOrder = beforeSubtask.sort_order || 0;
        const afterOrder = afterSubtask.sort_order || 0;
        newSortOrder = (beforeOrder + afterOrder) / 2;
        
      } else if (beforeId) {
        // Belirtilen alt görevden önce yerleştir
        const beforeSubtask = await this.getById(beforeId);
        if (!beforeSubtask) {
          throw new Error(`Referans alt görev bulunamadı: ${beforeId}`);
        }
        
        const beforeOrder = beforeSubtask.sort_order || 0;
        newSortOrder = beforeOrder - 1;
        
      } else if (afterId) {
        // Belirtilen alt görevden sonra yerleştir  
        const afterSubtask = await this.getById(afterId);
        if (!afterSubtask) {
          throw new Error(`Referans alt görev bulunamadı: ${afterId}`);
        }
        
        const afterOrder = afterSubtask.sort_order || 0;
        newSortOrder = afterOrder + 1;
        
      } else {
        // En sona taşı
        const maxSortOrderResult = await DatabaseManager.queryFirst<{ max_sort: number | null }>(
          'SELECT MAX(sort_order) as max_sort FROM subtasks WHERE task_id = ? AND deleted_at IS NULL AND id != ?',
          [movingSubtask.task_id, subtaskId]
        );
        
        newSortOrder = (maxSortOrderResult?.max_sort || 0) + 1;
      }

      // Yeni sıralamayı güncelle
      await this.updateSortOrder(subtaskId, newSortOrder);
    });
  }
}
