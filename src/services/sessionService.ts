export class SessionService {
  private static token: string | null = null;

  static saveToken(token: string): void {
    this.token = token;
  }

  static getToken(): string | null {
    return this.token;
  }

  static clearToken(): void {
    this.token = null;
  }

  static getUserRole(): 'ADMIN' | 'USER' | null {
    const payload = this.decodeTokenPayload();
    return payload?.role ?? null;
  }

  static getUser(): { id: number; name: string; role: 'ADMIN' | 'USER' } | null {
    const payload = this.decodeTokenPayload();
    if (!payload) return null;

    return {
      id: payload.id,
      name: payload.name,
      role: payload.role,
    };
  }

  private static decodeTokenPayload():
    | { id: number; name: string; role: 'ADMIN' | 'USER' }
    | null {
    if (!this.token) return null;

    try {
      const [, payloadBase64] = this.token.split('.');
      const decoded = Buffer.from(payloadBase64, 'base64').toString();
      const payload = JSON.parse(decoded);


      if (
        typeof payload.id === 'number' &&
        typeof payload.name === 'string' &&
        (payload.role === 'ADMIN' || payload.role === 'USER')
      ) {
        return payload;
      }

      return null;
    } catch (err) {
      console.error('[SessionService] Failed to decode token:', err);
      return null;
    }
  }
}
