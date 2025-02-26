import React from "react";
import { Link } from "react-router-dom";
import { Button, Box, Container, Typography } from "@mui/material";

export const Body = () => {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        textAlign="center"
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome to Your Learning Course Tracker...!!! Please Login!
        </Typography>
        <Button variant="contained" color="primary" component={Link} to="/login">
          Login
        </Button>
      </Box>
    </Container>
  );
};
