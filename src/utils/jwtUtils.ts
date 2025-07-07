import { TokenStorage } from "./tokenStorage";

export interface TokenPayload {
  id?: number;
  name?: string;
  email?: string;
}

export function parseToken(): TokenPayload | null {
  const token = TokenStorage.getToken();
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function getUserIdFromToken(): number | null {
  const payload = parseToken();
  return payload?.id ?? null;
}

export function getUserNameFromToken(): string {
  const payload = parseToken();
  return payload?.name || "";
}

export function getUserEmailFromToken(): string {
  const payload = parseToken();
  return payload?.email || "";
}
