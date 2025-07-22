import pool from "../config/db";
import { User } from "../models/userModel";

export class UserService {
  async getAllUsers(): Promise<User[]> {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows as User[];
  }

  async deleteUser(userId: number): Promise<void> {
    await pool.query("DELETE FROM users WHERE id = ?", [userId]);
  }

  async updateUserStatus(userId: number, isActive: boolean): Promise<void> {
    await pool.query("UPDATE users SET active = ? WHERE id = ?", [
      isActive,
      userId,
    ]);
  }

  async updateUserRole(userId: number, role: "USER" | "ADMIN"): Promise<void> {
    await pool.query("UPDATE users SET role = ? WHERE id = ?", [role, userId]);
  }
}
