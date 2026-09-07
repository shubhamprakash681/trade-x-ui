import apiClient from "./client";
import type {
  AuthResponse,
  LoginRequest,
  LogoutRequest,
  PasswordRecoveryRequest,
  PasswordResetRequest,
  SignupRequest,
  UserResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "@/types/api.types";

export const authApi = {
  signup: (data: SignupRequest) =>
    apiClient.post<AuthResponse>("/api/auth/signup", data).then((r) => r.data),

  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>("/api/auth/login", data).then((r) => r.data),

  refresh: (refreshToken: string) =>
    apiClient
      .post<AuthResponse>("/api/auth/refresh", { refreshToken } as object)
      .then((r) => r.data),

  logout: (refreshToken: string) =>
    apiClient
      .post<void>("/api/auth/logout", { refreshToken } as LogoutRequest)
      .then((r) => r.data),

  getMe: () =>
    apiClient.get<UserResponse>("/api/users/me").then((r) => r.data),

  updateProfile: (data: UpdateProfileRequest) =>
    apiClient.put<UserResponse>("/api/users/me", data).then((r) => r.data),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient
      .post<UserResponse>("/api/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  deleteAvatar: () =>
    apiClient.delete<UserResponse>("/api/users/me/avatar").then((r) => r.data),

  changePassword: (data: ChangePasswordRequest) =>
    apiClient.put<void>("/api/users/password", data).then((r) => r.data),

  requestPasswordRecovery: (data: PasswordRecoveryRequest) =>
    apiClient
      .post<void>("/api/auth/password-recovery/request", data)
      .then((r) => r.data),

  resetPassword: (data: PasswordResetRequest) =>
    apiClient
      .post<void>("/api/auth/password-recovery/reset", data)
      .then((r) => r.data),
};
