import React, { JSX } from "react";
import NavigationBar from "../components/NavigationBar";
import ConfirmationModal from "../components/ConfirmationModal";
import Toast from "../components/Toast";
import { useAdminServers } from "../../hooks/useAdminServers";
import "../styles/AdminServersPage.css";

function AdminServersPage(): JSX.Element {
  const {
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
  } = useAdminServers();

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
