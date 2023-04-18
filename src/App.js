import React, { useState, useEffect } from 'react';
import { auth } from "./firebase";
import Login from "./login";
import Register from "./register";
import Home from "./Home"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Header from "./header"

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
            <Route path="/" element={<Home />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
