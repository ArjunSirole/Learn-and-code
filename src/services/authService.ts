import pool from "../config/db";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

interface AuthUser {
  id: number;
  name: string;
  role: string;
}

interface NewUser {
  name: string;
  email: string;
  password: string;
}

export class AuthService {
  async findUserByEmail(email: string): Promise<any | null> {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const users = rows as any[];
    return users.length ? users[0] : null;
  }

  async createUser({ name, email, password }: NewUser): Promise<void> {
    const hashedPassword = await hashPassword(password);
    await pool.query(
      "INSERT INTO users (name, email, password, role, active) VALUES (?, ?, ?, 'USER', true)",
      [name, email, hashedPassword]
    );
  }

  async validatePassword(input: string, stored: string): Promise<boolean> {
    return comparePassword(input, stored);
  }

  createAuthToken(user: AuthUser): string {
    return generateToken(user);
  }
}
