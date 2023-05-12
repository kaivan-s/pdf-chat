import React, { useState, useRef } from "react";
import { auth } from "../Firebase/firebase";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Header = ({ user }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  // const [scrollPos, setScrollPos] = useState(0);
  // const scrollRef = useRef(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const handleSubscriptionStatusClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // const handleScroll = () => {
  //   if (scrollRef.current) {
  //     const node = scrollRef.current;
  //     node.scrollTop = scrollPos + 50; // adjust the scroll distance as needed
  //     setScrollPos(node.scrollTop);
  //   }
  // };

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
                <MenuItem onClick={handleSubscriptionStatusClick}>Subscription Status</MenuItem>
              </Menu>
              <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="xs">
                <DialogTitle sx={{backgroundColor:"black", color:'white', fontFamily:"TimesNewRoman"}}>Active Plan: Basic
                  <IconButton edge="end" color="inherit" onClick={handleDialogClose} sx={{ position: 'absolute', right: 8, top: 4 }}>
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent sx={{padding:0, marginTop:1, marginBottom:1}}>
                  <Grid container spacing={2}>
                    <Grid item xs={false} sm={1} />
                    <Grid item xs={12} sm={5}>
                      <Box bgcolor={'black'} height="30vh" borderRadius={3}>
                      <Typography variant="h6" sx={{color:'white', fontFamily:"TimesNewRoman", textAlign:'center'}} >Basic Plan</Typography>
                      <Divider style={{backgroundColor:"white", borderStyle:"dashed"}}></Divider>
                      <List>
                        <ListItem>
                          <ListItemIcon sx={{minWidth:'30px'}}><CheckCircleIcon style={{color:'white', width:'20px'}}/></ListItemIcon>
                          <ListItemText primary={<Typography variant="subtitle2" sx={{color:"white"}}>Chat with 3 documents</Typography>} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon sx={{minWidth:'30px'}}><CheckCircleIcon style={{color:'white', width:'20px'}}/></ListItemIcon>
                          <ListItemText primary={<Typography variant="subtitle2" sx={{color:"white"}}>Store History</Typography>} />
                        </ListItem>
                      </List>
                      <Button variant="contained" disabled style={{marginTop: '8vh', color: 'black', backgroundColor: 'darkgray', marginLeft:50}}>Free</Button>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <Box bgcolor={'black'} height="30vh" borderRadius={3}>
                      <Typography variant="h6" sx={{color:'white', fontFamily:"TimesNewRoman", textAlign:'center'}} >Basic + Pro Plan</Typography>
                      <Divider style={{backgroundColor:"white", borderStyle:"dashed"}}></Divider>
                      <Box style={{ maxHeight: '20vh', overflow: 'auto', scrollbarWidth: 'thin',
                            '&::-webkit-scrollbar': { 
                              width: '8px',
                            },
                            '&::-webkit-scrollbar-thumb': { 
                              backgroundColor: 'white',
                              borderRadius: '4px',
                            }
                          }}
                        >
                        <List>
                          <ListItem>
                            <ListItemIcon sx={{minWidth:'30px'}}><CheckCircleIcon style={{color:'white', width:'20px'}}/></ListItemIcon>
                            <ListItemText primary={<Typography variant="subtitle2" sx={{color:"white"}}>Chat with Unlimited documents</Typography>} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon sx={{minWidth:'30px'}}><CheckCircleIcon style={{color:'white', width:'20px'}}/></ListItemIcon>
                            <ListItemText primary={<Typography variant="subtitle2" sx={{color:"white"}}>Process large PDFs</Typography>} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon sx={{minWidth:'30px'}}><CheckCircleIcon style={{color:'white', width:'20px'}}/></ListItemIcon>
                            <ListItemText primary={<Typography variant="subtitle2" sx={{color:"white"}}>Process other types of documents (PPT, Docx) </Typography>} />
                          </ListItem>
                          {/* <ArrowDropDownIcon onClick={handleScroll} style={{color: 'white', position: 'absolute', bottom: '35%', right: '5%'}}/> */}
                        </List>
                      </Box>
                      <Button variant="contained" style={{marginTop: 20, color: 'black', backgroundColor: 'white', marginLeft:55}}>Buy</Button>
                      </Box>
                    </Grid>
                    <Grid item xs={false} sm={1} />
                  </Grid>
                </DialogContent>
              </Dialog>
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
