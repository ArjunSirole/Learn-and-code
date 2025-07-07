import apiClient from "../api/apiClient";
import { NotificationConfig } from "../interfaces/notificationConfig";
import { getUserIdFromToken } from "../utils/jwtUtils";

export const getPreferences = async (): Promise<NotificationConfig> => {
  const userId = getUserIdFromToken();
  const response = await apiClient.get<{
    data: NotificationConfig & { id: number };
  }>(`/notifications/${userId}`);
  return response.data.data;
};

export const savePreferences = async (
  config: NotificationConfig
): Promise<void> => {
  const userId = getUserIdFromToken();
  await apiClient.post("/notifications/configure", {
    user_id: userId,
    ...config,
  });
};
