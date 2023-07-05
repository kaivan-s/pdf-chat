import React, { useState } from "react";
import { auth } from "../Firebase/firebase";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from '@mui/icons-material/Logout';
import MoneyIcon from '@mui/icons-material/Money';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';

const Header = ({ user }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const handlePricing = () => {
    navigate("/pricing")
  }

  const handleAccount = () => {
    navigate("/account")
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "transparent", boxShadow: "none", marginBottom: 10, zIndex:1301 }}>
      <Toolbar>
        <Typography variant="subtitle" component="div" sx={{ flexGrow: 1, marginLeft:'25vw' }}></Typography>
        <nav>
          {user ? (
            <>
              <IconButton onClick={handleClick} color="inherit">
                <Avatar>{user.email.charAt(0).toUpperCase()}</Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose}>
                <MenuItem onClick={handleAccount}><AccountCircleIcon /><Box ml={1}>Account</Box></MenuItem>
                <MenuItem onClick={handleLogout}><LogoutIcon /><Box ml={1}>Logout</Box></MenuItem>
                <MenuItem onClick={handlePricing}><MoneyIcon /><Box ml={1}>Pricing</Box></MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {/* <Button color="inherit" component={Link} to="/login"> Login</Button>
              <Button color="inherit" component={Link} to="/register"> Register</Button> */}
            </>
          )}
        </nav>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
