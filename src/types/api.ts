export interface LoginResponse {
  message: string;
  token: string;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
}
