import React from 'react';
import { Button, Box } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { auth } from '../Firebase/firebase';

const stripePromise = loadStripe('pk_live_51N3ffVSDnmZGzrWBx6p7GTDHIIZPj8CkQgVe1no0O9CQ7qPPUEUy6qCr7YHN4BoKoid1sW27PmrAP1xBDHPNXrsf008jq9Jb5x');

// const featureList = [
//   'Chat with unlimited documents.',
//   'Process large PDF\'s.',
//   'Process other types of documents (PPT, Docx).',
//   'Download your chat with documents.'
// ];

const CheckoutButton = () => {
  const handleClick = async (event) => {
    const stripe = await stripePromise;
    const response = await fetch('https://api.docchat.in/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid: auth.currentUser.uid }),
    });
    const session = await response.json();
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
    }
  };

  return (
    <>
      {/* <Box sx={{ bgcolor: 'black', padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 15, width: '90%' }}>
        <Typography variant="h5" color="white" fontFamily="TimesNewRoman">Features</Typography>
      </Box>
      <List>
        {featureList.map((feature, id) => (
          <ListItem key={`feature-${id}`}>
            <ListItemIcon><CheckCircleIcon style={{ color: 'black' }} /></ListItemIcon>
            <ListItemText primary={<Typography variant="h6" sx={{ color: "black" }} fontFamily="TimesNewRoman">{feature}</Typography>} />
          </ListItem>
        ))}
      </List> */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button variant="contained" style={{ color: 'white', backgroundColor: 'black' }} onClick={handleClick}>Subscribe</Button>
      </Box>
    </>
  );
};

export default CheckoutButton;
