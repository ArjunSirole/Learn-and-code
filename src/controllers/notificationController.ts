import { Request, Response } from "express";
import { NotificationService } from "../services/notificationService";
import db from "../config/db";
import { RowDataPacket } from "mysql2";
import { logger } from "../utils/logger";

const notificationService = new NotificationService();

export async function fetchNotificationConfig(
  req: Request,
  res: Response
): Promise<void> {
  const userId = parseInt(req.params.user_id);

  if (isNaN(userId)) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }

  try {
    const config = await notificationService.getNotificationConfig(userId);

    if (!config || config.length === 0) {
      res.status(404).json({ message: "Notification configuration not found" });
      return;
    }

    res.status(200).json({
      message: "Notification configuration retrieved successfully",
      data: config[0],
    });
  } catch (error) {
    handleError("retrieving notification configuration", error, res);
  }
}

export async function updateNotificationPreferences(
  req: Request,
  res: Response
): Promise<void> {
  const userId = parseInt(req.body.user_id);

  if (isNaN(userId)) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }

  const { business, entertainment, sports, technology, keywords } = req.body;

  const missingFields = [business, entertainment, sports, technology].some(
    (val) => val === undefined
  );
  if (missingFields) {
    res.status(400).json({
      message:
        "Missing required notification preferences: business, entertainment, sports, technology",
    });
    return;
  }

  try {
    await notificationService.updateNotificationConfig(userId, {
      business,
      entertainment,
      sports,
      technology,
      keywords,
    });

    res
      .status(200)
      .json({ message: "Notification preferences updated successfully" });
  } catch (error) {
    handleError("updating notification preferences", error, res);
  }
}

export async function fetchUserNotifications(
  req: Request,
  res: Response
): Promise<void> {
  const userId = parseInt(req.params.user_id);

  if (isNaN(userId)) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }

  const limit = parseInt(req.query.limit as string) || 5;
  const offset = parseInt(req.query.offset as string) || 0;

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      `
      SELECT 
        n.id,
        n.user_id,
        n.title,
        n.category,
        n.published_at,
        n.url,
        n.is_read,
        a.description,
        a.source
      FROM notifications n
      JOIN articles a ON n.url = a.url
      WHERE n.user_id = ?
      ORDER BY n.published_at DESC
      LIMIT ? OFFSET ?
      `,
      [userId, limit, offset]
    );

    res.status(200).json({
      message: "Notifications retrieved successfully",
      data: rows,
    });
  } catch (error) {
    handleError("retrieving notifications", error, res);
  }
}

export async function markNotificationsAsRead(
  req: Request,
  res: Response
): Promise<void> {
  const userId = parseInt(req.body.user_id);
  const notificationIds = req.body.notificationIds;

  if (isNaN(userId) || !Array.isArray(notificationIds)) {
    res.status(400).json({ message: "Invalid input data" });
    return;
  }

  try {
    await db.query(
      `
      UPDATE notifications
      SET is_read = 1
      WHERE user_id = ? AND id IN (?)
      `,
      [userId, notificationIds]
    );

    res.status(200).json({ message: "Notifications marked as read." });
  } catch (error) {
    handleError("marking notifications as read", error, res);
  }
}

function handleError(context: string, error: unknown, res: Response): void {
  logger.error(`Error ${context}: ${formatError(error)}`);
  res.status(500).json({ message: `Internal server error while ${context}` });
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : JSON.stringify(error);
}
