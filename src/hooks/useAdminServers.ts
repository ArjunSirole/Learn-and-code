import { useState, useEffect, useCallback } from "react";
import {
  getServers,
  getServerDetails,
  updateServerApiKey,
} from "../services/serverApiService";
import { Server, ServerDetails } from "../interfaces/server";

export const useAdminServers = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServer, setSelectedServer] = useState<ServerDetails | null>(
    null
  );
  const [newApiKey, setNewApiKey] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmUpdate, setConfirmUpdate] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      const data = await getServers();
      setServers(data);
    } catch (err) {
      setError("Failed to load servers.");
    }
  };

  const fetchDetails = async (id: string) => {
    try {
      const data = await getServerDetails(id);
      setSelectedServer(data);
      setNewApiKey(data.api_key || "");
    } catch (err) {
      setError("Failed to load server details.");
    }
  };

  const handleApiKeyUpdate = useCallback(async (): Promise<void> => {
    if (!selectedServer) {
      console.warn("handleApiKeyUpdate called without a selectedServer");
      return;
    }

    setUpdating(true);
    try {
      await updateServerApiKey(selectedServer.id, newApiKey);
      setToastMessage("API key updated successfully.");
      setConfirmUpdate(false);
      await fetchServers();
    } catch (err) {
      setError("Failed to update API key.");
    } finally {
      setUpdating(false);
    }
  }, [selectedServer, newApiKey]);

  return {
    servers,
    selectedServer,
    newApiKey,
    error,
    toastMessage,
    confirmUpdate,
    updating,
    fetchDetails,
    handleApiKeyUpdate,
    setNewApiKey,
    setConfirmUpdate,
    setToastMessage,
  };
};
