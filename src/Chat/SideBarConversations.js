import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useConversations from './UseConversations';

function SidebarConversationList() {
  const navigate = useNavigate();
  const conversations = useConversations();

  const handleConversationClick = (fileName) => {
    navigate(`/chat/${fileName}`);
  };

  return (
    <Box sx={{height:'92vh', overflowY:'auto', bgcolor:'lightgray'}}>
      {conversations.map((conversation) => (
        <Box
          key={conversation.id}
          onClick={() => handleConversationClick(conversation.fileName)}
          sx={{ border: '1px dotted', borderRadius: 1, padding: 1, margin: 1, cursor: 'pointer',bgcolor:'black'}}>
          <Typography sx={{color:'white'}} variant="subtitle1">{conversation.fileName}</Typography>
          <Typography sx={{color:'whitesmoke'}} variant="caption">
            {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',}).format(conversation.latestMessage.timestamp)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default SidebarConversationList;
