import axios from "axios";
import useAuthStore from "../store/authStore";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor - Attach Token to Requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor - Handle Unauthorized or Tampered Token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response error:", error.response?.status, error.response?.data); // Log error details
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("Unauthorized/Forbidden! Token might be invalid or tampered.");
      localStorage.removeItem("token");
      useAuthStore.getState().logout();
      window.location.href = "/login"; // Use window.location for immediate redirect
    }
    return Promise.reject(error);
  }
);

export default api;