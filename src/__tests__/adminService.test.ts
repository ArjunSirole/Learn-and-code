import { AdminService } from "../services/adminService";
import pool from "../config/db";

jest.mock("../config/db");

describe("AdminService Tests", () => {
  let adminService: AdminService;

  beforeEach(() => {
    adminService = new AdminService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchServers", () => {
    it("should return an array of servers", async () => {
      const mockData = [
        {
          id: 1,
          name: "Server 1",
          status: "active",
          last_accessed: "2023-07-01",
        },
        {
          id: 2,
          name: "Server 2",
          status: "inactive",
          last_accessed: "2023-06-25",
        },
      ];

      (pool.query as jest.Mock).mockResolvedValue([mockData]);

      const result = await adminService.fetchServers();

      expect(result).toEqual(mockData);
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT id, name, status, last_accessed FROM servers"
      );
    });
  });

  describe("fetchServerById", () => {
    it("should return the server by ID", async () => {
      const mockData = {
        id: 1,
        name: "Server 1",
        status: "active",
        last_accessed: "2023-07-01",
      };

      (pool.query as jest.Mock).mockResolvedValue([[mockData]]);

      const result = await adminService.fetchServerById("1");

      expect(result).toEqual([mockData]);
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM servers WHERE id = ?",
        ["1"]
      );
    });
  });

  describe("updateServerKey", () => {
    it("should update the server API key", async () => {
      const mockResult = { affectedRows: 1 };

      (pool.query as jest.Mock).mockResolvedValue([mockResult]);

      const result = await adminService.updateServerKey("1", "new-api-key");

      expect(result).toEqual(mockResult);
      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE servers SET api_key = ?, last_accessed = NOW() WHERE id = ?",
        ["new-api-key", "1"]
      );
    });
  });

  describe("insertCategory", () => {
    it("should insert a new category", async () => {
      const mockResult = { affectedRows: 1 };

      (pool.query as jest.Mock).mockResolvedValue([mockResult]);

      const result = await adminService.insertCategory("Technology");

      expect(result[0]).toEqual(mockResult);
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO categories (name) VALUES (?)",
        ["Technology"]
      );
    });
  });

  describe("getUserStats", () => {
    it("should return user statistics", async () => {
      const mockStats = {
        total_users: 100,
        active_users: 80,
        inactive_users: 20,
      };

      (pool.query as jest.Mock).mockResolvedValue([mockStats]);

      const result = await adminService.getUserStats();

      expect(result).toEqual(mockStats);
      expect(pool.query).toHaveBeenCalledWith(`
        SELECT 
          (SELECT COUNT(*) FROM users) AS total_users,
          (SELECT COUNT(*) FROM users WHERE active = true) AS active_users,
          (SELECT COUNT(*) FROM users WHERE active = false) AS inactive_users
      `);
    });
  });
});
