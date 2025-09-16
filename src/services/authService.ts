import {loginSchema, LoginUser, registerSchema} from "@/schemas/auth";
import api from "@/lib/axios";
import type {APIResponse} from "@/lib/axios";
import NetworkStatus from "@/lib/networkStatus";

const isOnline = () => NetworkStatus.status;

type LoginData = {
  access_token: string;
  refresh_token: string;
}

export const login = async (data: unknown) => {
  if (!isOnline()) throw new Error("No internet connection");
  const {data: input, error} = loginSchema.safeParse(data);

  if (error) {
    console.error(error)
    throw new Error("Invalid data")
  }

  const {data: {data: loginData}} = await api.post<APIResponse<LoginData>>("/api/v1/public/auth/login", input);

  return loginData;
}

export const register = async (data: unknown) => {
  if (!isOnline()) throw new Error("No internet connection");
  const {data: input, error} = registerSchema.safeParse(data);

  if (error) {
    console.error(error)
    throw new Error("Invalid data")
  }

  const {data: {data: registerData}} = await api.post<APIResponse<LoginData>>("/api/v1/public/auth/register", input);

  return registerData;
}
