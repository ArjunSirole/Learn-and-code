import axios from "axios";
import { BASE_URL } from "../config/config";
import { SessionService } from "../services/sessionService";

const getHeaders = () => ({
  Authorization: `Bearer ${SessionService.getToken()}`,
});

export class NotificationApi {
  async getConfig() {
    const userId = SessionService.getUser()?.id;
    if (!userId) throw new Error("User ID not found");

    return axios.get(`${BASE_URL}/notifications/${userId}`, {
      headers: getHeaders(),
    });
  }

  async updateConfig(config: {
    business: boolean;
    entertainment: boolean;
    sports: boolean;
    technology: boolean;
    keywords?: string;
  }) {
    const userId = SessionService.getUser()?.id;
    if (!userId) throw new Error("User ID not found");

    return axios.post(
      `${BASE_URL}/notifications/configure`,
      { user_id: userId, ...config },
      { headers: getHeaders() }
    );
  }

  async getNotifications(limit = 5, offset = 0) {
    const userId = SessionService.getUser()?.id;
    if (!userId) throw new Error("User ID not found");

    return axios.get(`${BASE_URL}/notifications/${userId}/articles`, {
      headers: getHeaders(),
      params: { limit, offset },
    });
  }

  async markAsRead(notificationIds: number[]) {
    const userId = SessionService.getUser()?.id;
    if (!userId) throw new Error("User ID not found");

    return axios.post(
      `${BASE_URL}/notifications/mark-read`,
      {
        user_id: userId,
        notification_ids: notificationIds,
      },
      { headers: getHeaders() }
    );
  }

  async markAsUnread(notificationIds: number[]) {
    const userId = SessionService.getUser()?.id;
    if (!userId) throw new Error("User ID not found");

    return axios.post(
      `${BASE_URL}/notifications/mark-read`,
      {
        user_id: userId,
        notification_ids: notificationIds,
        unread: true,
      },
      { headers: getHeaders() }
    );
  }
}
