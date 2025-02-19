import React from "react";
import { Link } from "react-router-dom";
import { Button, Box, Container } from "@mui/material";

export const Body = () => {
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Button variant="contained" color="primary" component={Link} to="/login">
          Login
        </Button>
      </Box>
    </Container>
  );
};
