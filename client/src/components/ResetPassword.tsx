import React from "react";
import { useForm } from "react-hook-form";
import { API_URL } from "../constant/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { register, handleSubmit } = useForm({
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: { password: string; confirmPassword: string }) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: data.password, token }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Password reset successful!");
        navigate("/login");
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Reset password error:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography variant="h4">Reset Password</Typography>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("password", { required: "Password is required" })}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("confirmPassword", { required: "Confirm password is required" })}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Reset Password
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ResetPassword;
