import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../constant/api";
import { useNavigate } from "react-router-dom";
import React from "react";
import { Container, Typography, Button, Box, Card, CardContent, Skeleton } from "@mui/material";

const Home = () => {
  const { userId, token, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [fact, setFact] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId || !token) navigate("/");

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setUsername(data.username);
        } else {
          
          logout();
        }
      } catch (error) {
        console.error("Fetching user data failed:", error);
      }
    };

    const fetchRandomFact = async () => {
      try {
        const response = await fetch("https://uselessfacts.jsph.pl/random.json?language=en");
        const data = await response.json();
        setFact(data.text);
      } catch (error) {
        console.error("Fetching random fact failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchRandomFact();
  }, [userId, token, logout, navigate]);

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography variant="h4" gutterBottom>
          Welcome, {loading ? "GUEST" : username}!
        </Typography>
        <Card variant="outlined" sx={{ mt: 3, p: 2, width: '100%' }}>
          <CardContent>
            <Typography variant="h6">Today's Random Fact:</Typography>
            {loading ? <div><Skeleton height={40} />
            <Skeleton width={100} /> </div> : <Typography variant="body1" mt={1}>{fact}</Typography>}
          </CardContent>
        </Card>
        <Button 
          variant="contained" 
          color="secondary" 
          sx={{ mt: 3 }}
          onClick={() => { logout(); navigate("/login"); }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
