import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { logger } from "../utils/logger"; 

const authService = new AuthService();

export async function handleSignup(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Name, email, and password are required" });
    return;
  }

  try {
    const userExists = await authService.findUserByEmail(email);

    if (userExists) {
      logger.warn(`Signup attempt with existing email: ${email}`);
      res.status(409).json({ message: "Email already exists" });
      return;
    }

    await authService.createUser({ name, email, password });
    logger.info(`User signed up successfully: ${email}`);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    logger.error(`Signup Error: ${formatError(error)}`);
    res.status(500).json({ message: "Server error during signup" });
  }
}

export async function handleLogin(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  try {
    const user = await authService.findUserByEmail(email);

    if (!user) {
      logger.warn(`Login failed. User not found: ${email}`);
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isPasswordValid = await authService.validatePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      logger.warn(`Invalid login credentials for: ${email}`);
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = authService.createAuthToken({
      id: user.id,
      name: user.name,
      role: user.role,
    });

    logger.info(`Login successful for: ${email}`);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    logger.error(`Login Error: ${formatError(error)}`);
    res.status(500).json({ message: "Server error during login" });
  }
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : JSON.stringify(error);
}
