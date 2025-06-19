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
}
