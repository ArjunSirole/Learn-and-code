import apiClient from "./apiClient";
import { Server, ServerDetails } from "../interfaces/server";

export async function getServers(): Promise<Server[]> {
  const res = await apiClient.get<Server[]>("/admin/servers");
  return res.data;
}

export async function getServerDetails(id: string): Promise<ServerDetails> {
  const res = await apiClient.get<ServerDetails>(`/admin/servers/${id}`);
  return res.data;
}

export async function updateServerApiKey(
  id: string,
  apiKey: string
): Promise<void> {
  await apiClient.put(`/admin/servers/${id}/apikey`, { apiKey });
}
