import { Server, ServerDetails } from "../interfaces/server";
import apiClient from "../api/apiClient";

export const getServers = async (): Promise<Server[]> => {
  try {
    const response = await apiClient.get<Server[]>("/admin/servers");
    return response.data;
  } catch (err) {
    throw new Error("Failed to load servers.");
  }
};

export const getServerDetails = async (id: string): Promise<ServerDetails> => {
  try {
    const response = await apiClient.get<ServerDetails>(`/admin/servers/${id}`);
    return response.data;
  } catch (err) {
    throw new Error("Failed to load server details.");
  }
};

export const updateServerApiKey = async (
  serverId: string,
  newApiKey: string
): Promise<void> => {
  try {
    await apiClient.put(`/admin/servers/${serverId}/update-api-key`, {
      api_key: newApiKey,
    });
  } catch (err) {
    throw new Error("Failed to update API key.");
  }
};
