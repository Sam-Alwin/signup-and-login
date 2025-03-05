import { useEffect, useState } from "react"; 
import { useForm } from "react-hook-form";
import useAuthStore from "../store/authStore";
import { API_URL } from "../constant/api";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";

const Login = () => {
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
    reset();
  }, [isAuthenticated, navigate, reset]);

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    setError(""); 
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        login(result.token);
        navigate("/dashboard", { replace: true });
      } else {
        setError(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form
          onSubmit={handleSubmit(handleLogin)}
          style={{ width: "100%" }}
          autoComplete="off"
        >
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            autoComplete="new-email"
            {...register("email", { required: "Email is required" })}
            error={!!error}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            autoComplete="new-password"
            {...register("password", { required: "Password is required" })}
            error={!!error}
            helperText={error}
          />
          <Box mt={2} display="flex" flexDirection="column" gap={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => navigate("/register")}
              disabled={loading}
            >
              Register
            </Button>
            <Button
              variant="text"
              color="secondary"
              onClick={() => navigate("/forgot-password")}
              disabled={loading}
            >
              Forgot Password?
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Login;