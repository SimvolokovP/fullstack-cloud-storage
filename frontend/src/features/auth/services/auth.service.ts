import { API, AUTH_API } from "@/shared/api/api.config";
import {
  IAuthResponse,
  ILoginCredentials,
  IRegisterCredentials,
  IUser,
  IUpdateProfileCredentials,
  IChangePasswordCredentials,
  IChangeEmailCredentials,
  IRegisterResponse,
} from "../types/auth.types";

export const authService = {
  async register(data: IRegisterCredentials) {
    const response = await API.post<IRegisterResponse>("/auth/register", data);
    return response.data;
  },

  async login(data: ILoginCredentials) {
    const response = await API.post<IAuthResponse>("/auth/login", data);
    return response.data;
  },

  async logout() {
    const response = await API.post<void>("/auth/logout");
    return response.data;
  },

  async verifyEmail(token: string) {
    const response = await API.post<void>("/auth/email-confirmation", {
      token,
    });
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await API.post<void>("/auth/password-recovery/reset", {
      email,
    });
    return response.data;
  },

  async resetPassword(token: string, password: string) {
    const response = await API.post<void>(
      `/auth/password-recovery/new/${token}`,
      { password },
    );
    return response.data;
  },

  async getProfile(id: string) {
    const response = await AUTH_API.get<IUser>(`/users/${id}`);
    return response.data;
  },

  async updateProfile(id: string, data: IUpdateProfileCredentials) {
    const response = await AUTH_API.put<IUser>(`/users/${id}`, data);
    return response.data;
  },

  async changePassword(id: string, data: IChangePasswordCredentials) {
    const response = await AUTH_API.patch<void>(`/users/${id}/password`, data);
    return response.data;
  },

  async changeEmail(id: string, data: IChangeEmailCredentials) {
    const response = await AUTH_API.patch<void>(`/users/${id}/email`, data);
    return response.data;
  },
};
