import React, { JSX, useCallback, useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import ConfirmationModal from "../components/ConfirmationModal";
import Toast from "../components/Toast";
import { getServers, getServerDetails, updateServerApiKey } from "../../api/serverApi";
import { Server, ServerDetails } from "../../interfaces/server";
import "../styles/AdminServersPage.css";


function AdminServersPage(): JSX.Element {
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedServer, setSelectedServer] = useState<ServerDetails | null>(null);
  const [newApiKey, setNewApiKey] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmUpdate, setConfirmUpdate] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    fetchServers();
  }, []);

  async function fetchServers(): Promise<void> {
    setError("");
    try {
      const data = await getServers();
      setServers(data);
    } catch (err: unknown) {
      console.error("[AdminServersPage.fetchServers]:", err);
      setError("Failed to load servers.");
    }
  }

  async function fetchDetails(id: string): Promise<void> {
    setError("");
    try {
      const data = await getServerDetails(id);
      setSelectedServer(data);
      setNewApiKey(data.api_key || "");
    } catch (err: unknown) {
      console.error("[AdminServersPage.fetchDetails]:", err);
      setError("Failed to load server details.");
    }
  }

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
    } catch (err: unknown) {
      console.error("[AdminServersPage.handleApiKeyUpdate]:", err);
      setError("Failed to update API key.");
    } finally {
      setUpdating(false);
    }
  }, [selectedServer, newApiKey]);

  return (
    <>
      <NavigationBar />
      <div className="table-wrapper">
        <div className="servers-container">
          <h2>External Servers</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <table className="server-list">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Last Accessed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {servers.map((server) => (
                <tr key={server.id}>
                  <td>{server.name}</td>
                  <td>{server.status}</td>
                  <td>{new Date(server.last_accessed).toLocaleString()}</td>
                  <td className="server-actions">
                    <button onClick={() => fetchDetails(server.id)}>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedServer && (
            <div className="update-form">
              <h3>Server Details: {selectedServer.name}</h3>
              <p>
                <strong>Status:</strong> {selectedServer.status}
              </p>
              <p>
                <strong>Last Accessed:</strong>{" "}
                {new Date(selectedServer.last_accessed).toLocaleString()}
              </p>

              <label>API Key</label>
              <input
                type="text"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
                required
              />
              <button
                onClick={() => setConfirmUpdate(true)}
                style={{ marginTop: "12px" }}
                disabled={updating}
              >
                Update API Key
              </button>
            </div>
          )}
        </div>
      </div>

      {confirmUpdate && (
        <ConfirmationModal
          title="Confirm API Key Update"
          description="Are you sure you want to update the API Key for this server?"
          confirmLabel="Update"
          onConfirm={handleApiKeyUpdate}
          onCancel={() => setConfirmUpdate(false)}
          loading={updating}
        />
      )}

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </>
  );
}

export default AdminServersPage;
