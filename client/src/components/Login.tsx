import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../constant/api";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        login(result.userId, result.token);
        navigate("/home");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit(handleLogin)} style={{ width: "100%" }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            {...register("email", { required: true })}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("password", { required: true })}
          />
          <Box mt={2} display="flex" flexDirection="column" gap={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
            <Button variant="text" color="secondary" onClick={() => navigate("/forgot-password")}
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
