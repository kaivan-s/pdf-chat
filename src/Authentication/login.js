import React, { useState } from "react";
import { auth } from "../Firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
  Paper,
  Grid,
} from "@mui/material";

function Login() {

  const theme = createTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: 'rgb(0,0,0)',
      },
      secondary: {
        // This is green.A700 as hex.
        main: '#11cb5f',
      },
    },
  });
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Grid container alignItems="center" justifyContent="center" style={{ minHeight: "100vh" }}>
        <Paper elevation={3} style={{ padding: "2rem", borderRadius: "15px" }}>
          <Typography variant="h4" align="center"> Login </Typography>
          <form onSubmit={handleSubmit}>
            <Box mt={2}>
              <TextField fullWidth label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </Box>
            <Box mt={2}>
              <TextField fullWidth type="password" label="Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </Box>
            <ThemeProvider theme={theme}>
              <Box mt={2}>
                <Button fullWidth type="submit" variant="contained" color="primary">Login</Button>
              </Box>
            </ThemeProvider>
          </form>
          {/* <Box mt={2}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </Box> */}
          {error && (
            <Box mt={2}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
        </Paper>
      </Grid>
    </Container>
  );
}

export default Login;
