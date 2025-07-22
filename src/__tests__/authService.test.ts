import { AuthService } from "../services/authService";
import pool from "../config/db";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

jest.mock("../config/db");
jest.mock("../utils/hash");
jest.mock("../utils/jwt");

describe('AuthService Tests', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserByEmail', () => {
    it('should return user if email exists', async () => {
      const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com', role: 'USER' };

      (pool.query as jest.Mock).mockResolvedValue([[mockUser]]);

      const result = await authService.findUserByEmail('john@example.com');
      
      expect(result).toEqual(mockUser);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM users WHERE email = ?", ['john@example.com']);
    });

    it('should return null if email does not exist', async () => {
      (pool.query as jest.Mock).mockResolvedValue([[]]);

      const result = await authService.findUserByEmail('nonexistent@example.com');
      
      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM users WHERE email = ?", ['nonexistent@example.com']);
    });
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const mockUser = { name: 'John Doe', email: 'john@example.com', password: 'password' };
      const hashedPassword = 'hashed_password';

      (hashPassword as jest.Mock).mockResolvedValue(hashedPassword);
      (authService.findUserByEmail as jest.Mock).mockResolvedValue(null); 

      (pool.query as jest.Mock).mockResolvedValue([{ affectedRows: 1 }]);

      await authService.createUser(mockUser);

      expect(hashPassword).toHaveBeenCalledWith('password');
      expect(authService.findUserByEmail).toHaveBeenCalledWith('john@example.com');
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO users (name, email, password, role, active) VALUES (?, ?, ?, 'USER', true)",
        ['John Doe', 'john@example.com', hashedPassword]
      );
    });

    it('should throw error if email already exists', async () => {
      const mockUser = { name: 'John Doe', email: 'john@example.com', password: 'password' };

      (authService.findUserByEmail as jest.Mock).mockResolvedValue({});

      await expect(authService.createUser(mockUser)).rejects.toThrow("Email already exists");
      expect(authService.findUserByEmail).toHaveBeenCalledWith('john@example.com');
    });
  });

  describe('validatePassword', () => {
    it('should return true if passwords match', async () => {
      const inputPassword = 'input_password';
      const storedPassword = 'hashed_password';

      (comparePassword as jest.Mock).mockResolvedValue(true);

      const result = await authService.validatePassword(inputPassword, storedPassword);

      expect(result).toBe(true);
      expect(comparePassword).toHaveBeenCalledWith(inputPassword, storedPassword);
    });

    it('should return false if passwords do not match', async () => {
      const inputPassword = 'input_password';
      const storedPassword = 'hashed_password';

      (comparePassword as jest.Mock).mockResolvedValue(false);

      const result = await authService.validatePassword(inputPassword, storedPassword);

      expect(result).toBe(false);
      expect(comparePassword).toHaveBeenCalledWith(inputPassword, storedPassword);
    });
  });

  describe('createAuthToken', () => {
    it('should generate auth token for a valid user', () => {
      const mockUser = { id: 1, name: 'John Doe', role: 'USER' };
      const mockToken = 'generated_token';

      (generateToken as jest.Mock).mockReturnValue(mockToken);

      const result = authService.createAuthToken(mockUser);

      expect(result).toBe(mockToken);
      expect(generateToken).toHaveBeenCalledWith(mockUser);
    });
  });
});
