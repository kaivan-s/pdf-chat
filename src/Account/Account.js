import React from 'react';
import { Box } from '@mui/material';
import Header from "../Header/header";

function Account({user}) {
  return (
    <>
      <Header user={user}/>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', justifyContent: 'center', alignItems: 'center',}}>
        <Box sx={{  width: '50%', height: '50%', bgcolor: 'darkgray', borderRadius:3}}>
        </Box>
      </Box>
    </>
  );
}

export default Account;
