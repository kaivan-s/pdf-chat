import React, { useState } from "react";
import { auth } from "../Firebase/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
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
  Grid, CircularProgress, IconButton
} from "@mui/material";
import GoogleLogo from '../Images/GoogleIcon.png';
import { googleSignIn } from "../Firebase/Google/GoogleAuthenticator";
import AuthProviderButtons from "../Firebase/Authenticator/AuthProvider";

function Login() {

  const theme = createTheme({
    palette: {
      primary: {
        main: 'rgb(0,0,0)',
      },
      secondary: {
        main: '#11cb5f',
      },
    },
  });
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (!result.user.emailVerified) {
        setError("Email verification pending. Please verify your email address.");
        setLoading(false);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (email === "") {
      setError("Please enter your email address.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setError("Password reset email sent. Please check your inbox.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn(navigate);
    } catch (error) {
      setError(error.message);
    }
  };  

  return (
    <Container maxWidth="xs">
      <Grid container alignItems="center" justifyContent="center" style={{ minHeight: "100vh" }}>
        <Paper elevation={3} style={{ padding: "2rem", borderRadius: "15px", width:'80vw' }}>
          <Typography variant="h4" align="center"> Login </Typography>
          <form onSubmit={handleSubmit}>
            <Box mt={2}>
              <TextField fullWidth label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </Box>
            <Box mt={2}>
              <TextField fullWidth type="password" label="Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </Box>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Box mt={0}>
                  <ThemeProvider theme={theme}>
                    <Button color="primary" size="small" onClick={handleForgotPassword}>Forgot Password?</Button>
                  </ThemeProvider>
                </Box>
              </Grid>
            </Grid>
            <ThemeProvider theme={theme}>
              <Box mt={2}>
                {loading ? (
                  <ThemeProvider theme={theme}>
                    <CircularProgress color="primary" size="2rem" />
                  </ThemeProvider>
                ) : (
                  <ThemeProvider theme={theme}>
                    <Button fullWidth type="submit" variant="contained" color="primary">Login</Button>
                  </ThemeProvider>
                )}
              </Box>
            </ThemeProvider>
            <Box mt={1} display="flex" justifyContent="center">
              <IconButton onClick={handleGoogleSignIn}>
                <img src={GoogleLogo} alt="Google Login" width="40" height="40" />
              </IconButton>
              {/* <AuthProviderButtons /> */}
          </Box>
          </form>
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
