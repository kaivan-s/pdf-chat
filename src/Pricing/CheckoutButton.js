import React from 'react';
import { Button, Box, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_live_51N3ffVSDnmZGzrWBx6p7GTDHIIZPj8CkQgVe1no0O9CQ7qPPUEUy6qCr7YHN4BoKoid1sW27PmrAP1xBDHPNXrsf008jq9Jb5x');

const CheckoutButton = () => {
  const handleClick = async (event) => {
    const stripe = await stripePromise;
    const response = await fetch('http://127.0.0.1:5000/create-checkout-session', { method: 'POST' });

    const session = await response.json();
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
    }
  };

  return (
    <>
    <Box sx={{bgcolor:'black', padding:2, display:'flex', justifyContent:'center', alignItems:'center'}}>
        <Typography variant="h5" color="white" fontFamily="TimesNewRoman">Premium Plan</Typography>
    </Box>
    <Box>
        <List>
            <ListItem>
                <ListItemIcon><CheckCircleIcon style={{color:'black'}}/></ListItemIcon>
                <ListItemText primary={<Typography variant="h6" sx={{color:"black"}}fontFamily="TimesNewRoman">Chat with unlimited documents.</Typography>} />
            </ListItem>
            <ListItem>
                <ListItemIcon><CheckCircleIcon style={{color:'black'}}/></ListItemIcon>
                <ListItemText primary={<Typography variant="h6" sx={{color:"black"}}fontFamily="TimesNewRoman">Process large PDF's.</Typography>} />
            </ListItem>
            <ListItem>
                <ListItemIcon><CheckCircleIcon style={{color:'black'}}/></ListItemIcon>
                <ListItemText primary={<Typography variant="h6" sx={{color:"black"}}fontFamily="TimesNewRoman">Process other types of documents (PPT, Docx).</Typography>} />
            </ListItem>
        </List>
        <Box sx={{display:'flex', alignItems:'center', justifyContent:'center', marginTop:10}}>
            <Button variant="contained" style={{color: 'white', backgroundColor: 'black'}} onClick={handleClick}>Checkout</Button>
        </Box>
    </Box>
    </>
  );
};

export default CheckoutButton;
