import axios from 'axios';
import { getSession } from 'next-auth/react';

// Make sure to add a trailing slash if your API requires it
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const publicRequest = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const userRequest = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Update the interceptor to get token from NextAuth session
userRequest.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession();
      if (session?.user?.access_token) {
        config.headers.Authorization = `Bearer ${session.user.access_token}`;
      } else {
        // Fall back to localStorage if needed
        const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Error getting session:", error);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to better debug errors
publicRequest.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data
      });
    }
    return Promise.reject(error);
  }
);

export { publicRequest, userRequest };