import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../Firebase/firebase";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";

const Header = ({ user }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "transparent", boxShadow: "none", marginBottom: 10, zIndex:1301 }}>
      <Toolbar>
        <Typography variant="subtitle" component="div" sx={{ flexGrow: 1, marginLeft:'25vw' }}>
        </Typography>
        <nav>
          {user ? (
            <>
              <IconButton onClick={handleClick} color="inherit">
                <Avatar>{user.email.charAt(0).toUpperCase()}</Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose}>
                <MenuItem disabled>{user.email}</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login"> Login</Button>
              <Button color="inherit" component={Link} to="/register"> Register</Button>
            </>
          )}
        </nav>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
