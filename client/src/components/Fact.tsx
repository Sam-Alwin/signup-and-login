import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useAuthStore from "../store/authStore"; 
import { API_URL } from "../constant/api";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box, Card, CardContent, Skeleton } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();
  const { userId, token, isAuthenticated, logout } = useAuthStore(); 
  const { setValue, watch } = useForm({
    defaultValues: {
      username: "",
      fact: "",
      loading: true,
    },
  });
  const username = watch("username");
  const fact = watch("fact");
  const loading = watch("loading");

  useEffect(() => {
    if (!isAuthenticated) navigate("/login"); 

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setValue("username", data.username);
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
        setValue("fact", data.text);
      } catch (error) {
        console.error("Fetching random fact failed:", error);
      } finally {
        setValue("loading", false);
      }
    };

    fetchUserData();
    fetchRandomFact();
  }, [isAuthenticated, userId, token, logout, navigate, setValue]);

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography variant="h4" gutterBottom>
          Welcome, {loading ? "GUEST" : username}!
        </Typography>
        <Card variant="outlined" sx={{ mt: 3, p: 2, width: '100%' }}>
          <CardContent>
            <Typography variant="h6">Today's Random Fact:</Typography>
            {loading ? (
              <div>
                <Skeleton height={40} />
                <Skeleton width={100} />
              </div>
            ) : (
              <Typography variant="body1" mt={1}>{fact}</Typography>
            )}
          </CardContent>
        </Card>

        
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 3, width: '100%' }}
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")} 
        >
          Go to My Dashboard
        </Button>

        
        <Button 
          variant="contained" 
          color="secondary" 
          sx={{ mt: 2, width: '100%' }}
          onClick={() => { logout(); navigate("/login"); }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
