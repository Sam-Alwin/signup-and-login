import React ,{ createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
  userId: string | null;
  token: string | null;
  login: (userId: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(localStorage.getItem("userId"));
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const login = (userId: string, token: string) => {
    setUserId(userId);
    setToken(token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUserId(null);
    setToken(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ userId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
