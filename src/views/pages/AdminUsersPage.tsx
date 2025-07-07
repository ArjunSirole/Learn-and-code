import React, { JSX, useState } from "react";
import { useAdminUsers } from "../../hooks/useAdminUsers";
import NavigationBar from "../components/NavigationBar";
import ConfirmationModal from "../components/ConfirmationModal";
import Toast from "../components/Toast";
import "../styles/AdminUsersPage.css";

function AdminUsersPage(): JSX.Element {
  const {
    users,
    error,
    toastMessage,
    confirmAction,
    loading,
    setConfirmAction,
    setToastMessage,
    handleConfirm,
  } = useAdminUsers();

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
                    onClick={() => setConfirmAction({ user, type: "toggle" })}
                  >
                    {user.active ? "Deactivate" : "Reactivate"}
                  </button>
                  <button
                    onClick={() => setConfirmAction({ user, type: "role" })}
                  >
                    Make {user.role === "ADMIN" ? "User" : "Admin"}
                  </button>
                  <button
                    onClick={() => setConfirmAction({ user, type: "delete" })}
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
