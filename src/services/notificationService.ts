import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../config/db";

export interface NotificationPreferences {
  business: boolean;
  entertainment: boolean;
  sports: boolean;
  technology: boolean;
  keywords?: string;
}

export class NotificationService {
  async getNotificationConfig(userId: number): Promise<RowDataPacket[]> {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM notification_config WHERE user_id = ?",
      [userId]
    );
    return rows;
  }

  async updateNotificationConfig(
    userId: number,
    preferences: NotificationPreferences
  ): Promise<ResultSetHeader> {
    const { business, entertainment, sports, technology, keywords } =
      preferences;

    const [result] = await db.execute<ResultSetHeader>(
      `
      INSERT INTO notification_config (
        user_id, business, entertainment, sports, technology, keywords
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        business = VALUES(business),
        entertainment = VALUES(entertainment),
        sports = VALUES(sports),
        technology = VALUES(technology),
        keywords = VALUES(keywords)
      `,
      [userId, business, entertainment, sports, technology, keywords]
    );

    return result;
  }
}
