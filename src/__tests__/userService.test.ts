import { UserService } from "../services/userService";
import pool from "../config/db";

jest.mock("../config/db");

describe("UserService Tests", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const mockUsers = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          role: "USER",
          active: true,
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          role: "ADMIN",
          active: false,
        },
      ];

      pool.query.mockResolvedValueOnce([mockUsers]);

      const result = await userService.getAllUsers();

      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM users");
      expect(result).toEqual(mockUsers);
    });

    it("should return an empty array if no users exist", async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const result = await userService.getAllUsers();

      expect(result).toEqual([]);
    });

    it("should throw an error if database query fails", async () => {
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      await expect(userService.getAllUsers()).rejects.toThrow("Database error");
    });
  });

  describe("deleteUser", () => {
    it("should delete a user by ID", async () => {
      const userId = 1;

      pool.query.mockResolvedValueOnce([{}]);

      await userService.deleteUser(userId);

      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM users WHERE id = ?",
        [userId]
      );
    });

    it("should throw an error if database query fails", async () => {
      const userId = 1;
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      await expect(userService.deleteUser(userId)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("updateUserStatus", () => {
    it("should update the user's active status", async () => {
      const userId = 1;
      const isActive = true;

      pool.query.mockResolvedValueOnce([{}]);

      await userService.updateUserStatus(userId, isActive);

      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE users SET active = ? WHERE id = ?",
        [isActive, userId]
      );
    });

    it("should throw an error if database query fails", async () => {
      const userId = 1;
      const isActive = true;

      pool.query.mockRejectedValueOnce(new Error("Database error"));

      await expect(
        userService.updateUserStatus(userId, isActive)
      ).rejects.toThrow("Database error");
    });
  });

  describe("updateUserRole", () => {
    it("should update the user's role", async () => {
      const userId = 1;
      const role: "USER" | "ADMIN" = "ADMIN";

      pool.query.mockResolvedValueOnce([{}]);

      await userService.updateUserRole(userId, role);

      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE users SET role = ? WHERE id = ?",
        [role, userId]
      );
    });

    it("should throw an error if database query fails", async () => {
      const userId = 1;
      const role: "USER" | "ADMIN" = "ADMIN";

      pool.query.mockRejectedValueOnce(new Error("Database error"));

      await expect(userService.updateUserRole(userId, role)).rejects.toThrow(
        "Database error"
      );
    });
  });
});
