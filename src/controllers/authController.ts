import { Request, Response } from "express";
import { AuthService } from "../services/authService";

const authService = new AuthService();

export async function handleSignup(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body;

  try {
    const userExists = await authService.findUserByEmail(email);

    if (userExists) {
      res.status(409).json({ message: "Email already exists" });
      return;
    }

    await authService.createUser({ name, email, password });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    logError("Signup", error);
    res.status(500).json({ message: "Server error during signup" });
  }
}

export async function handleLogin(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  try {
    const user = await authService.findUserByEmail(email);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isPasswordValid = await authService.validatePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = authService.createAuthToken({
      id: user.id,
      name: user.name,
      role: user.role,
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    logError("Login", error);
    res.status(500).json({ message: "Server error during login" });
  }
}

function logError(context: string, error: unknown): void {
  console.error(`${context} Error:`, error);
}
