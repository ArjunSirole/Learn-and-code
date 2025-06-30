import * as auth from "../services/authService";
import pool from "../config/config";

describe("Authentication Service", () => {
  const email = "testuser@example.com";
  const name = "Test User";
  const password = "test123";

  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email = ?", [email]);
    await pool.end();
  });

  it("should sign up a new user", async () => {
    const msg = await auth.signupUser(name, email, password);
    expect(msg).toBe(" User registered successfully!");
  });

  it("should log in existing user", async () => {
    const user = await auth.loginUser(email, password);
    expect(user.email).toBe(email);
  });
});
