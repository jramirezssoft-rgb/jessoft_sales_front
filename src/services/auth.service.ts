import axios from "axios";
import { env } from "../config/env";
import type { LoginResponse } from "../types/api";
import { cacheToken, getCachedToken } from "../lib/auth-token";

const LOGIN_EMAIL = "admin@jessoft.com";
const LOGIN_PASSWORD = "admin@jessoft.com";
let loginRequest: Promise<string> | null = null;

export async function getAuthToken(): Promise<string> {
  const cachedToken = getCachedToken();
  if (cachedToken) return cachedToken;

  if (!loginRequest) {
    loginRequest = axios
      .post<LoginResponse>(`${env.apiUrl}/auth/login`, {
        email: LOGIN_EMAIL,
        password: LOGIN_PASSWORD,
      })
      .then(({ data }) => {
        if (!data.token) {
          throw new Error("El servicio de autenticación no devolvió un token.");
        }

        cacheToken(data.token);
        return data.token;
      })
      .finally(() => {
        loginRequest = null;
      });
  }

  return loginRequest;
}
