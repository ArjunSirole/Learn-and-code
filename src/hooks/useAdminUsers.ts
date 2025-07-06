import { useState, useEffect, useCallback } from "react";
import {
  getUsers,
  deleteUser,
  toggleUserStatus,
  changeUserRole,
} from "../services/userApiService";
import { User } from "../interfaces/user";

export const useAdminUsers = () => {
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

  const fetchUsers = async () => {
    setError("");
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError("Failed to load users.");
    }
  };

  const handleConfirm = useCallback(async (): Promise<void> => {
    if (!confirmAction) return;

    const { user, type } = confirmAction;
    setLoading(true);

    try {
      if (type === "delete") {
        await deleteUser(user.id);
        setToastMessage(`Deleted ${user.name}.`);
      } else if (type === "toggle") {
        await toggleUserStatus(user.id, user.active);
        setToastMessage(
          `${user.active ? "Deactivated" : "Reactivated"} ${user.name}.`
        );
      } else if (type === "role") {
        await changeUserRole(user.id, user.role);
        setToastMessage(
          `Changed role to ${user.role === "ADMIN" ? "User" : "Admin"} for ${
            user.name
          }.`
        );
      }

      setConfirmAction(null);
      fetchUsers();
    } catch (err) {
      setError("Operation failed.");
      setConfirmAction(null);
    } finally {
      setLoading(false);
    }
  }, [confirmAction]);

  return {
    users,
    error,
    toastMessage,
    confirmAction,
    loading,
    setConfirmAction,
    setToastMessage,
    handleConfirm,
  };
};
