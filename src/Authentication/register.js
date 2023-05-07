import React, { useState } from "react";
import { auth } from "../Firebase/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
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
  Grid, CircularProgress
} from "@mui/material";

function Register() {

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
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(result.user)
      setLoading(false);
      setEmailSent(true);
      // navigate('/');
    } catch (err) {
      console.log(err)
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Grid container alignItems="center" justifyContent="center" style={{ minHeight: "100vh" }}>
        <Paper elevation={3} style={{ padding: "2rem", borderRadius: "15px", width:'80vw'}}>
          <Typography variant="h4" align="center" sx={{fontFamily:'TimesNewRoman'}}> Start your journey </Typography>
          <form onSubmit={handleSubmit}>
            <Box mt={2}>
              <TextField fullWidth label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </Box>
            <Box mt={2}>
              <TextField fullWidth type="password" label="Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </Box>
            <Box mt={2}>
              {loading ? (
                <ThemeProvider theme={theme}>
                  <CircularProgress color="primary" size="2rem" />
                </ThemeProvider>
              ) : (
                <ThemeProvider theme={theme}>
                  <Button fullWidth type="submit" variant="contained" color="primary">Register</Button>
                </ThemeProvider>
              )}
            </Box>
          </form>
          {emailSent ? (
            <Box mt={2}>
              <Alert severity="success">
                Verification email sent! Please check your email and follow the instructions to complete registration.
                <Button color="primary" size="small" onClick={() => navigate("/resend-verification")}> Resend verification link</Button>
              </Alert>
            </Box>
          ) : (error && (
              <Box mt={2}>
                <Alert severity="error">{error}</Alert>
              </Box>
            )
          )}
        </Paper>
      </Grid>
    </Container>
  );
}

export default Register;
