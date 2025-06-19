import {
    deleteUser,
    updateUserRole,
    updateUserStatus,
    getAllUsers,
  } from "../services/userService";
  import pool from "../config/config";
  
  describe("Admin User Management Actions", () => {
    let testUserId: number;
  
    beforeAll(async () => {
      const [result] = await pool.query(
        `INSERT INTO users (name, email, password, role, active) 
         VALUES ('Test User', 'testuser_admin@example.com', 'test123', 'USER', TRUE)`
      );
      testUserId = (result as any).insertId;
    });
  
    afterAll(async () => {
      await pool.query("DELETE FROM users WHERE email = ?", ["testuser_admin@example.com"]);
      await pool.end();
    });
  
    it("should deactivate a user", async () => {
      await updateUserStatus(testUserId, false);
      const users = await getAllUsers();
      const user = users.find((u) => u.id === testUserId);
      expect(user?.active).toBe(0);
    });
  
    it("should reactivate a user", async () => {
      await updateUserStatus(testUserId, true);
      const users = await getAllUsers();
      const user = users.find((u) => u.id === testUserId);
      expect(user?.active).toBe(1);
    });
  
    it("should change user role to ADMIN", async () => {
      await updateUserRole(testUserId, "ADMIN");
      const users = await getAllUsers();
      const user = users.find((u) => u.id === testUserId);
      expect(user?.role).toBe("ADMIN");
    });
  
    it("should delete a user", async () => {
      await deleteUser(testUserId);
      const users = await getAllUsers();
      const user = users.find((u) => u.id === testUserId);
      expect(user).toBeUndefined();
    });
  });
  