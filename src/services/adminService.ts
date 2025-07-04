import pool from "../config/db";
import { OkPacket, RowDataPacket } from "mysql2";

export class AdminService {
  async fetchServers(): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, status, last_accessed FROM servers"
    );
    return rows;
  }

  async fetchServerById(id: string): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM servers WHERE id = ?",
      [id]
    );
    return rows;
  }

  async updateServerKey(id: string, apiKey: string): Promise<OkPacket> {
    const [result] = await pool.query<OkPacket>(
      "UPDATE servers SET api_key = ?, last_accessed = NOW() WHERE id = ?",
      [apiKey, id]
    );
    return result;
  }

  async insertCategory(name: string): Promise<[OkPacket, unknown]> {
    return pool.query<OkPacket>("INSERT INTO categories (name) VALUES (?)", [
      name,
    ]);
  }

  async removeNotificationConfig(userId: number): Promise<[OkPacket, unknown]> {
    return pool.query("DELETE FROM notification_config WHERE user_id = ?", [
      userId,
    ]);
  }

  async removeUser(userId: number): Promise<OkPacket> {
    const [result] = await pool.query<OkPacket>(
      "DELETE FROM users WHERE id = ?",
      [userId]
    );
    return result;
  }

  async setActiveStatus(userId: string, isActive: boolean): Promise<OkPacket> {
    const [result] = await pool.query<OkPacket>(
      "UPDATE users SET active = ? WHERE id = ?",
      [isActive, userId]
    );
    return result;
  }

  async modifyUserRole(userId: string, role: string): Promise<OkPacket> {
    const [result] = await pool.query<OkPacket>(
      "UPDATE users SET role = ? WHERE id = ?",
      [role, userId]
    );
    return result;
  }

  async getUserStats(): Promise<RowDataPacket> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
         (SELECT COUNT(*) FROM users) AS total_users,
         (SELECT COUNT(*) FROM users WHERE active = true) AS active_users,
         (SELECT COUNT(*) FROM users WHERE active = false) AS inactive_users`
    );
    return rows[0];
  }

  async getNewsStats(): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT category, COUNT(*) AS article_count FROM articles GROUP BY category"
    );
    return rows;
  }

  async getReportedArticles(): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT 
        ar.id AS report_id,
        ar.article_id,
        ar.user_id,
        ar.reason,
        ar.created_at,
        a.title,
        a.url,
        a.is_hidden,
        (
          SELECT COUNT(*) 
          FROM article_reports 
          WHERE article_id = ar.article_id
        ) AS report_count
      FROM article_reports ar
      JOIN articles a ON ar.article_id = a.id
      ORDER BY ar.created_at DESC
    `);
    return rows;
  }

  async hideArticle(articleId: number): Promise<OkPacket> {
    const [result] = await pool.query<OkPacket>(
      "UPDATE articles SET is_hidden = 1 WHERE id = ?",
      [articleId]
    );
    return result;
  }

  async dismissReport(reportId: number): Promise<OkPacket> {
    const [result] = await pool.query<OkPacket>(
      "DELETE FROM article_reports WHERE id = ?",
      [reportId]
    );
    return result;
  }

  async hideCategory(categoryName: string): Promise<OkPacket> {
    const [result] = await pool.query<OkPacket>(
      "UPDATE categories SET hidden = 1 WHERE name = ?",
      [categoryName]
    );
    return result;
  }

  async unhideCategory(categoryName: string): Promise<OkPacket> {
    const [result] = await pool.query<OkPacket>(
      "UPDATE categories SET hidden = 0 WHERE name = ?",
      [categoryName]
    );
    return result;
  }

  async getCategories(): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, hidden FROM categories ORDER BY name"
    );
    return rows;
  }

  async getBannedKeywords(): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, keyword, enabled FROM banned_keywords ORDER BY keyword"
    );
    return rows;
  }

  async addBannedKeyword(keyword: string): Promise<[OkPacket, unknown]> {
    return pool.query<OkPacket>(
      "INSERT IGNORE INTO banned_keywords (keyword, enabled) VALUES (?, TRUE)",
      [keyword]
    );
  }

  async removeBannedKeyword(id: number): Promise<OkPacket> {
    const [result] = await pool.query<OkPacket>(
      "DELETE FROM banned_keywords WHERE id = ?",
      [id]
    );
    return result;
  }

  async disableBannedKeyword(id: number): Promise<OkPacket> {
    const [result] = await pool.query<OkPacket>(
      "UPDATE banned_keywords SET enabled = FALSE WHERE id = ?",
      [id]
    );
    return result;
  }

  async enableBannedKeyword(id: number): Promise<OkPacket> {
    const [result] = await pool.query<OkPacket>(
      "UPDATE banned_keywords SET enabled = TRUE WHERE id = ?",
      [id]
    );
    return result;
  }

  async unhideArticle(articleId: number): Promise<OkPacket> {
    const [result] = await pool.query<OkPacket>(
      "UPDATE articles SET is_hidden = 0 WHERE id = ?",
      [articleId]
    );
    return result;
  }
}
