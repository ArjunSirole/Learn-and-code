import {
  NotificationService,
  NotificationPreferences,
} from "../services/notificationService";
import db from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

jest.mock("../config/db");

describe("NotificationService Tests", () => {
  let notificationService: NotificationService;

  beforeEach(() => {
    notificationService = new NotificationService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getNotificationConfig", () => {
    it("should return notification config for a given user", async () => {
      const mockConfig = [
        {
          user_id: 1,
          business: true,
          entertainment: false,
          sports: true,
          technology: false,
          keywords: "tech,sports",
        },
      ];

      db.execute.mockResolvedValueOnce([mockConfig]);

      const userId = 1;
      const result = await notificationService.getNotificationConfig(userId);

      expect(db.execute).toHaveBeenCalledWith(
        "SELECT * FROM notification_config WHERE user_id = ?",
        [userId]
      );
      expect(result).toEqual(mockConfig);
    });

    it("should return an empty array if no configuration is found", async () => {
      db.execute.mockResolvedValueOnce([[]]);

      const result = await notificationService.getNotificationConfig(2);

      expect(result).toEqual([]);
    });

    it("should throw an error if database query fails", async () => {
      db.execute.mockRejectedValueOnce(new Error("Database error"));

      await expect(
        notificationService.getNotificationConfig(1)
      ).rejects.toThrow("Database error");
    });
  });

  describe("updateNotificationConfig", () => {
    it("should insert a new notification config if it doesn't exist", async () => {
      const preferences: NotificationPreferences = {
        business: true,
        entertainment: false,
        sports: true,
        technology: false,
        keywords: "tech, sports",
      };

      const mockResult: ResultSetHeader = {
        affectedRows: 1,
        insertId: 1,
        changedRows: 0,
      };

      db.execute.mockResolvedValueOnce([mockResult]);

      const result = await notificationService.updateNotificationConfig(
        1,
        preferences
      );

      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO notification_config"),
        [
          1,
          preferences.business,
          preferences.entertainment,
          preferences.sports,
          preferences.technology,
          preferences.keywords,
        ]
      );
      expect(result).toEqual(mockResult);
    });

    it("should update an existing notification config if it already exists", async () => {
      const preferences: NotificationPreferences = {
        business: false,
        entertainment: true,
        sports: false,
        technology: true,
        keywords: "tech",
      };

      const mockResult: ResultSetHeader = {
        affectedRows: 1,
        insertId: 0,
        changedRows: 1,
      };

      db.execute.mockResolvedValueOnce([mockResult]);

      const result = await notificationService.updateNotificationConfig(
        1,
        preferences
      );

      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining("ON DUPLICATE KEY UPDATE"),
        [
          1,
          preferences.business,
          preferences.entertainment,
          preferences.sports,
          preferences.technology,
          preferences.keywords,
        ]
      );
      expect(result).toEqual(mockResult);
    });

    it("should handle errors if the update query fails", async () => {
      const preferences: NotificationPreferences = {
        business: true,
        entertainment: true,
        sports: true,
        technology: true,
        keywords: "tech,sports",
      };

      db.execute.mockRejectedValueOnce(new Error("Database error"));

      await expect(
        notificationService.updateNotificationConfig(1, preferences)
      ).rejects.toThrow("Database error");
    });
  });
});
