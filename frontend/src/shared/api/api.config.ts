import axios, { CreateAxiosDefaults, AxiosError } from "axios";

interface BackendErrorResponse {
  message: string | string[];
}

export interface BackendErrorData {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/`
  : "http://localhost:4000/api/";

const options: CreateAxiosDefaults = {
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
};

export const errorCatch = (error: AxiosError<BackendErrorResponse>): string => {
  const message = error?.response?.data?.message;
  return message
    ? typeof message === "object"
      ? message[0]
      : message
    : error.message;
};

const API = axios.create(options);
const AUTH_API = axios.create(options);

AUTH_API.interceptors.response.use(
  (config) => config,
  async (error: AxiosError<BackendErrorResponse>) => {
    return Promise.reject(error);
  },
);

export { API, AUTH_API, BASE_URL };
