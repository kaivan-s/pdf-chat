import React, { useState, useEffect } from 'react';
import { auth } from "./Firebase/firebase";
import Login from "./Authentication/login";
import Register from "./Authentication/register";
import Home from "./Main/Home";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ChatPage from './Chat/ChatPage';
import Account from './Account/Account';
import LandingPage from './Landing/Landing';
import DocumentChat from './Images/DocumentChat.png'
import ResendVerification from './Authentication/ResentVerification';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          {(!user || (!user.emailVerified && user.isSubscribed)) ? (
            <>
              <Grid item xs={12} md={6} sx={{ backgroundColor: 'black' }}>
                <LeftColumn />
              </Grid>
              <Grid item xs={12} md={6} sx={{ backgroundColor: "darkgray" }}>
                <Routes>
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login user={user} />} />
                  <Route path="/resend-verification" element={<ResendVerification />} />
                  <Route index element={<Login user={user} />} />
                </Routes>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <Routes>
                  <Route path="/chat/:fileName" element={<ChatPage />} />
                  <Route path="/" element={<Home user={user} />} />
                  <Route path="/landing" element={<LandingPage user={user}/>} />
                  <Route path="/account" element={<Account user={user} />} />
                </Routes>
              </Grid>
            </>
          )}
        </Grid>
        {/* <Footer /> */}
      </Box>
    </Router>
  );
}

function LeftColumn() {
  const location = useLocation();

  let title;
  let message;
  let linkPath;

  if (location.pathname === '/register') {
    title = 'Already an User? ';
    message = 'Login Here';
    linkPath = '/login';
  } else {
    title = 'New User? ';
    message = 'Register Here';
    linkPath = '/register';
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <img src={DocumentChat} alt="Document Chat" style={{ maxWidth: '50%', maxHeight: '50%', marginBottom: 2 }} /> {/* Display the image */}
      <Typography variant="h4" sx={{ color: 'white', fontFamily:'TimesNewRoman', fontWeight:'bold' }}> Chat with Documents </Typography>
      <br></br>
      <Typography variant="subtitle" align="center" sx={{ color: 'white', marginBottom: 2 }}>
        {title}
          <Link to={linkPath} style={{ textDecoration: 'none' }}>
            <Typography variant="subtitle" align="center" sx={{ color: 'white', textDecoration: 'underline' }}> {message} </Typography>
          </Link>
      </Typography>
    </Box>
  );
}
export default App;