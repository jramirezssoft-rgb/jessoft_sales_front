const TOKEN_STORAGE_KEY = "jessoftsales.auth-token";
const EXPIRATION_SAFETY_WINDOW_SECONDS = 30;

interface CachedToken {
  token: string;
  expiresAt: number;
}

function decodeTokenExpiration(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(atob(normalizedPayload));
    return typeof decodedPayload.exp === "number"
      ? decodedPayload.exp * 1000
      : null;
  } catch {
    return null;
  }
}

function readCachedToken(): CachedToken | null {
  const rawToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
  if (!rawToken) return null;

  try {
    const cachedToken = JSON.parse(rawToken) as CachedToken;
    if (!cachedToken.token || !cachedToken.expiresAt) return null;
    return cachedToken;
  } catch {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    return null;
  }
}

export function getCachedToken(): string | null {
  const cachedToken = readCachedToken();
  if (!cachedToken) return null;

  const safetyWindow = EXPIRATION_SAFETY_WINDOW_SECONDS * 1000;
  if (Date.now() >= cachedToken.expiresAt - safetyWindow) {
    clearCachedToken();
    return null;
  }

  return cachedToken.token;
}

export function cacheToken(token: string): void {
  const expiresAt = decodeTokenExpiration(token);
  if (!expiresAt) {
    throw new Error(
      "El token recibido no contiene una fecha de expiración válida.",
    );
  }

  sessionStorage.setItem(
    TOKEN_STORAGE_KEY,
    JSON.stringify({ token, expiresAt }),
  );
}

export function clearCachedToken(): void {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
}
