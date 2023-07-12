import React, { useEffect, useState } from "react";
import { auth }  from '../Firebase/firebase'
import { Box, Grid, Typography, Button } from '@mui/material';
import CheckoutButton from '../Pricing/CheckoutButton';
import Header from '../Header/header'
import error from '../Images/error-wait.gif'
import { getUserSubscriptionStatus } from "../Firebase/firebase";
import { useNavigate } from "react-router-dom";

const LandingPage = ({user}) => {
const [isSubscribed, setSubscribed] = useState(false); 
const navigate = useNavigate()
useEffect(() => {
    async function protect() {
        const user = auth.currentUser;
        if (user) { 
        const subscriptionStatus = await getUserSubscriptionStatus(user); 
        setSubscribed(subscriptionStatus['subscribed']);
        }
    }
    protect();
}, []); 
  return (
    <>
    <Header user={user}/>
    <Box sx={{ flexGrow: 1, m: 2,  height: '45vh', width: '95%', mx: 'auto', mt:10}}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt:20, mb:2}}>
                <Typography variant="h4" sx={{ color: 'white', fontFamily:'TimesNewRoman', fontWeight:'bold' }}> Chat with Documents </Typography>
                <Typography variant="subtitle1" sx={{ color: 'white', fontFamily:'TimesNewRoman', fontWeight:'bold' }}> Your Documents, Now Interactive! </Typography>
            </Box>
            {isSubscribed ? <Button variant="contained" style={{ color: 'white', backgroundColor: 'black' }} onClick={navigate('/')}>Home</Button> : <CheckoutButton />}
        </Grid>
        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ border: '10px solid #000', padding: '20px', borderRadius: '20px', backgroundColor: 'white' }}>
            <img src={error} alt="Tool" style={{ width: 400, height: "auto", borderRadius: 15}}/>
          </Box>
        </Grid>
      </Grid>
      {/* <Box sx={{ m: 2, height: 300, width: '55%', mx: 'auto', my:5, borderRadius:10}}>
        <Marquee velocity={12}>
          {_.times(NUM_FEATURES, Number).map(id => (
            <Box key={`box-${id}`} sx={{ width: 140, height: 200, borderRadius: 15, bgcolor: 'white', m: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography>Your Feature</Typography>
            </Box>
          ))}
        </Marquee>
      </Box> */}
    </Box>
    </>
  );
};

export default LandingPage;
