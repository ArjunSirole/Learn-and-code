import { useEffect, useState } from "react";
import { Notification } from "../interfaces/notification";
import { getUserIdFromToken } from "../utils/jwtUtils";
import {
  getUnreadNotifications,
  markNotificationsAsRead,
} from "../services/notificationService";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: "mark-all" | "mark-one";
    notificationId?: number;
  } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async (): Promise<void> => {
    setLoading(true);
    try {
      const userId = getUserIdFromToken();
      if (!userId) throw new Error("Invalid user token");

      const unread = await getUnreadNotifications(userId);
      setNotifications(unread);
    } catch (err) {
      console.error("[useNotifications.fetchNotifications]:", err);
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (): Promise<void> => {
    if (!confirmAction) return;

    const userId = getUserIdFromToken();
    if (!userId) {
      setError("Invalid user.");
      return;
    }

    setConfirmLoading(true);
    try {
      const ids =
        confirmAction.type === "mark-all"
          ? notifications.map((n) => n.id)
          : confirmAction.notificationId
          ? [confirmAction.notificationId]
          : [];

      await markNotificationsAsRead(userId, ids);

      setNotifications((prev) => prev.filter((n) => !ids.includes(n.id)));

      setToastMessage(
        confirmAction.type === "mark-all"
          ? "All notifications marked as read."
          : "Notification marked as read."
      );
      setConfirmAction(null);
    } catch (err) {
      console.error("[useNotifications.handleConfirm]:", err);
      setError("Failed to mark notifications as read.");
      setConfirmAction(null);
    } finally {
      setConfirmLoading(false);
    }
  };

  return {
    notifications,
    error,
    loading,
    toastMessage,
    setToastMessage,
    confirmAction,
    setConfirmAction,
    confirmLoading,
    handleConfirm,
  };
};
