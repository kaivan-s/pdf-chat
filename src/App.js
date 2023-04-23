import React, { useState, useEffect } from 'react';
import { auth } from "./Firebase/firebase";
import Login from "./Authentication/login";
import Register from "./Authentication/register";
import Home from "./Main/Home"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Header from "./Header/header"
import ChatPage from './Chat/ChatPage';

function App() {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) =>{
      setUser(user)
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if(loading) { return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh",}} >
      <CircularProgress />
    </Box>
  );}

  return (
    <Router>
      <Header user={user} />
      <Routes>
        {!user ? (
          <>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route index element={<Login setUser={setUser} />} />
          </>
        ) : (
          <>
            <Route path="/chat/:fileName" element={<ChatPage/>}/>
            <Route path="/" element={<Home />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
