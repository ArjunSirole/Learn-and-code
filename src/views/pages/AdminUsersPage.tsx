import React, { JSX, useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import NavigationBar from "../components/NavigationBar";
import ConfirmationModal from "../components/ConfirmationModal";
import Toast from "../components/Toast";
import "../styles/AdminUsersPage.css";
import { User } from "../../interfaces/user";

function AdminUsersPage(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [confirmAction, setConfirmAction] = useState<{
    user: User;
    type: "delete" | "toggle" | "role";
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers(): Promise<void> {
    setError("");
    try {
      const response = await apiClient.get<User[]>("/admin/users");
      setUsers(response.data);
    } catch (err) {
      console.error("[AdminUsersPage.fetchUsers]:", err);
      setError("Failed to load users.");
    }
  }

  async function handleConfirm(): Promise<void> {
    if (!confirmAction) return;

    const { user, type } = confirmAction;

    setLoading(true);

    try {
      if (type === "delete") {
        await apiClient.delete(`/admin/users/${user.id}`);
        setToastMessage(`Deleted ${user.name}.`);
      } else if (type === "toggle") {
        const endpoint = user.active
          ? `/admin/users/${user.id}/deactivate`
          : `/admin/users/${user.id}/reactivate`;
        await apiClient.put(endpoint);
        setToastMessage(
          `${user.active ? "Deactivated" : "Reactivated"} ${user.name}.`
        );
      } else if (type === "role") {
        const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
        await apiClient.put(`/admin/users/${user.id}/role`, { role: newRole });
        setToastMessage(`Changed role to ${newRole} for ${user.name}.`);
      }

      setConfirmAction(null);
      fetchUsers();
    } catch (err) {
      console.error("[AdminUsersPage.handleConfirm]:", err);
      setError("Operation failed.");
      setConfirmAction(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <NavigationBar />
      <div className="users-container">
        <h2>Manage Users</h2>
        {error && <p className="error">{error}</p>}

        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.active ? "Active" : "Inactive"}</td>
                <td className="user-actions">
                  <button
                    onClick={() =>
                      setConfirmAction({ user, type: "toggle" })
                    }
                  >
                    {user.active ? "Deactivate" : "Reactivate"}
                  </button>
                  <button
                    onClick={() =>
                      setConfirmAction({ user, type: "role" })
                    }
                  >
                    Make {user.role === "ADMIN" ? "User" : "Admin"}
                  </button>
                  <button
                    onClick={() =>
                      setConfirmAction({ user, type: "delete" })
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmAction && (
        <ConfirmationModal
          title="Confirm Action"
          description={
            confirmAction.type === "delete"
              ? `Are you sure you want to delete user "${confirmAction.user.name}"?`
              : confirmAction.type === "toggle"
              ? `Are you sure you want to ${
                  confirmAction.user.active ? "deactivate" : "reactivate"
                } user "${confirmAction.user.name}"?`
              : `Are you sure you want to change the role of "${
                  confirmAction.user.name
                }" to ${
                  confirmAction.user.role === "ADMIN" ? "User" : "Admin"
                }?`
          }
          confirmLabel="Confirm"
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
          loading={loading}
        />
      )}

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </>
  );
}

export default AdminUsersPage;
