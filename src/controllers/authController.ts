import axios from "axios";
import { TokenStorage } from "../utils/tokenStorage";
import { Interface } from "readline";

const API_BASE_URL = "http://localhost:3000";

interface User {
  id: number;
  name: string;
  role: "USER" | "ADMIN";
}

interface LoginResponse {
  token: string;
}

export class AuthController {
  public async login(email: string, password: string): Promise<void> {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_BASE_URL}/auth/login`,
        { email, password }
      );
      TokenStorage.setToken(response.data.token);
    } catch (error: unknown) {
      console.error("[AuthController.login]:", error);
      throw new Error("Incorrect user details! Please check your credentials.");
    }
  }

  public async signup(
    name: string,
    email: string,
    password: string
  ): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/auth/signup`, {
        name,
        email,
        password,
      });
    } catch (error: unknown) {
      console.error("[AuthController.signup]:", error);
      throw new Error("Failed to sign up. Please try again.");
    }
  }

  public getCurrentUser(): User | null {
    const token = TokenStorage.getToken();
    if (!token) return null;

    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(
      atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"))
    );

    return {
      id: decodedPayload.id,
      name: decodedPayload.name,
      role: decodedPayload.role,
    };
  }

  public logout(): void {
    TokenStorage.clearToken();
  }
}
