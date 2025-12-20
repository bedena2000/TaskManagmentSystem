import { api } from "@/lib/axios"

interface SignUpPayload {
  email: string;
  password: string;
}

interface SignInPayload {
  email: string;
  password: string;
}

interface SignInResponse {
  message: string;
  user: {
    id: string;
    email: string;
  };
  token: string;
}

export const signUp = async (data: SignUpPayload) => {
  const response = await api.post("/auth/register", data);
  return response.data;
}

export const signIn = async (data: SignInPayload): Promise<SignInResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};