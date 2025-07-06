import apiClient from "../api/apiClient";
import { Notification } from "../interfaces/notification";

export const getUnreadNotifications = async (
  userId: number
): Promise<Notification[]> => {
  try {
    const response = await apiClient.get<{ data: Notification[] }>(
      `/notifications/${userId}/articles`
    );
    return response.data.data.filter((n) => !n.is_read);
  } catch (error) {
    throw new Error("Failed to fetch notifications.");
  }
};

export const markNotificationsAsRead = async (
  userId: number,
  notificationIds: number[]
): Promise<void> => {
  try {
    await apiClient.post("/notifications/mark-read", {
      user_id: userId,
      notificationIds,
    });
  } catch (error) {
    throw new Error("Failed to mark notifications as read.");
  }
};
