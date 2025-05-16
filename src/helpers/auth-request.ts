import { publicRequest, userRequest } from "../lib/requests";
import { AxiosError } from "axios";

export async function login(username:string, password:string) {
  try {
    const res = await publicRequest.post('/auth/login', { username, password });
    // Assuming your backend returns { token: 'JWT_TOKEN', ... }
    const { token } = res.data;
    if (token) {
      localStorage.setItem('token', token);
    }
    return res.data;
  } catch (error:any) {
    // Customize error handling as needed
    throw error.response?.data || error;
  }
}

export async function forgotPassword(email: string) {
  try {
    const res = await publicRequest.post('/auth/forgot-password', { email });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export function logout() {
  localStorage.removeItem('token');
}

export async function getProtectedData() {
  // Example function using the authenticated axios instance
  try {
    const res = await userRequest.get('/auth/protected');
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}