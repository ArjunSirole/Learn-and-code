import { Router } from "express";
import {
  fetchNotificationConfig,
  fetchUserNotifications,
  markNotificationsAsRead,
  updateNotificationPreferences,
} from "../controllers/notificationController";
const router = Router();

router.get("/:user_id", fetchNotificationConfig);
router.post("/configure", updateNotificationPreferences);
router.get("/:user_id/articles", fetchUserNotifications);
router.post("/mark-read", markNotificationsAsRead);

export default router;
