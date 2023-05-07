import React, { useState } from 'react';
import { auth } from '../Firebase/firebase';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function ResendVerification() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const resendVerification = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const actionCodeSettings = {
        url: process.env.REACT_APP_CONFIRMATION_URL,
      };

      await auth.sendSignInLinkToEmail(email, actionCodeSettings);
      setMessage('A new verification email has been sent. Please check your inbox and click the link to verify your email address.');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={resendVerification}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h5">Resend Verification Email</Typography>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ marginBottom: 1, minWidth: 300 }}
      />
      <Button type="submit" variant="contained" color="primary">
        Resend Verification Email
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      {message && <Typography color="success.main">{message}</Typography>}
    </Box>
  );
}

export default ResendVerification;
