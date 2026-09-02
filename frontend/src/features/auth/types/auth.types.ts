export type UserRole = "REGULAR" | "ADMIN";
export type AuthMethod = "CREDENTIALS" | "GOOGLE" | "YANDEX";

export interface IUser {
  id: string;
  email: string;
  displayName: string;
  picture: string | null;
  role: UserRole;
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
  method: AuthMethod;
  createdAt: string;
  updatedAt: string;
}

export type IAuthResponse = IUser;

export interface ILoginCredentials {
  email: string;
  password: string;
  code?: string;
  recaptcha?: string;
}

export interface IRegisterCredentials {
  email: string;
  password: string;
  passwordRepeat: string;
  name: string;
  recaptcha?: string;
}

export interface IUpdateProfileCredentials {
  email?: string;
  name?: string;
  isTwoFactorEnabled?: boolean;
}

export interface IChangePasswordCredentials {
  oldPassword: string;
  newPassword: string;
}

export interface IChangeEmailCredentials {
  newEmail: string;
}
