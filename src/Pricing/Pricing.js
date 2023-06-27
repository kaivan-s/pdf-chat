import React from 'react';
import { Box } from '@mui/material';
import Header from "../Header/header";
import CheckoutButton from './CheckoutButton';

function Pricing({user}) {
  return (
    <>
      <Header user={user}/>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', justifyContent: 'center', alignItems: 'center',}}>
        <Box sx={{  width: '50%', height: '50%', bgcolor: 'darkgray', borderRadius:3}}>
            <CheckoutButton />
        </Box>
      </Box>
    </>
  );
}

export default Pricing;
