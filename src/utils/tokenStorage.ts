export class TokenStorage {
  private static readonly TOKEN_KEY = "token";

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static getUserPayload(): {
    id: number;
    name: string;
    email?: string;
    role: string;
  } | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      };
    } catch (err) {
      console.error(
        "[TokenStorage.getUserPayload] Failed to decode token:",
        err
      );
      return null;
    }
  }

  static getUserRole(): string | null {
    return this.getUserPayload()?.role || null;
  }
}
