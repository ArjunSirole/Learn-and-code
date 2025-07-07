import apiClient from "../api/apiClient";
import { User } from "../interfaces/user";

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get("/admin/users");
    return response.data as User[];
  } catch (err) {
    throw new Error("Failed to fetch users.");
  }
};

export const deleteUser = async (userId: number): Promise<void> => {
  try {
    await apiClient.delete(`/admin/users/${userId}`);
  } catch (err) {
    throw new Error("Failed to delete user.");
  }
};

export const toggleUserStatus = async (
  userId: number,
  isActive: boolean
): Promise<void> => {
  const endpoint = isActive
    ? `/admin/users/${userId}/deactivate`
    : `/admin/users/${userId}/reactivate`;
  try {
    await apiClient.put(endpoint);
  } catch (err) {
    throw new Error("Failed to toggle user status.");
  }
};

export const changeUserRole = async (
  userId: number,
  currentRole: string
): Promise<void> => {
  const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
  try {
    await apiClient.put(`/admin/users/${userId}/role`, { role: newRole });
  } catch (err) {
    throw new Error("Failed to change user role.");
  }
};
