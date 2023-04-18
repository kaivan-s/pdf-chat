import React from 'react';
import { useParams } from 'react-router-dom';
import Home from './Home';
import { Container, Box, Typography } from '@mui/material';

function ChatPage() {
  const { fileName } = useParams();

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Processed file: {fileName}
        </Typography>
        <Home />
      </Box>
    </Container>
  );
}

export default ChatPage;
