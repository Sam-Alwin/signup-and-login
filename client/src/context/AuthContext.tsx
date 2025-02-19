import React, { createContext, useContext, ReactNode, useReducer, useEffect } from "react";


interface AuthState {
  userId: string | null;
  token: string | null;
}


type AuthAction =
  | { type: "LOGIN"; payload: { userId: string; token: string } }
  | { type: "LOGOUT" };


const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { userId: action.payload.userId, token: action.payload.token };
    case "LOGOUT":
      return { userId: null, token: null };
    default:
      return state;
  }
};


interface AuthContextType {
  userId: string | null;
  token: string | null;
  login: (userId: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  const initialState: AuthState = {
    userId: localStorage.getItem("userId"),
    token: localStorage.getItem("token"),
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  
  useEffect(() => {
    if (state.userId && state.token) {
      localStorage.setItem("userId", state.userId);
      localStorage.setItem("token", state.token);
    } else {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
    }
  }, [state.userId, state.token]);

  
  const login = (userId: string, token: string) => {
    dispatch({ type: "LOGIN", payload: { userId, token } });
  };

  
  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ userId: state.userId, token: state.token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
