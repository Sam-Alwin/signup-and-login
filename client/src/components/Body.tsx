import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

export const Body = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      
      if (location.pathname === "/login") {
        navigate("/dashboard", { replace: true }); 
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/login", { replace: true }); 
    }
  }, [navigate, location.pathname, isAuthenticated]);

  return null; 
};
