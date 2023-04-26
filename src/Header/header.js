import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../Firebase/firebase";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const Header = ({ user }) => {

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <AppBar position="fixed" sx = {{ backgroundColor:'transparent', boxShadow:'none', marginBottom:10}}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1,}}>
          <Link to="/" style={{ textDecoration: "none", color:"inherit" }}>PDF Chat</Link>
        </Typography>
        <nav>
          {user ? (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
        </nav>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
