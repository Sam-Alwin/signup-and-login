import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  token: string | null;
  userId: number | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  validateToken: () => boolean; 
}

const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  userId: localStorage.getItem("token")
    ? jwtDecode<{ id: number }>(localStorage.getItem("token")!).id
    : null,
  isAuthenticated: !!localStorage.getItem("token"),

  login: (token) => {
    localStorage.setItem("token", token);
    set({
      token,
      userId: jwtDecode<{ id: number }>(token).id,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, userId: null, isAuthenticated: false });
  },

  validateToken: () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      jwtDecode(token); 
      return true;
    } catch (error) {
      console.error("Invalid token detected:", error);
      return false;
    }
  },
}));

export default useAuthStore;