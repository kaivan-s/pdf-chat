import React, { useState } from 'react';
import { Avatar, Container, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography, Box, Paper, Grid, IconButton, TextField, Collapse, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import useConversations from './UseConversations';
import deleteChat from '../Utilities/DeleteConversation';
import moment from 'moment';

function ConversationList() {

  const navigate = useNavigate();  
  let [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [deletedConversationId, setDeletedConversationId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  conversations = useConversations(deletedConversationId);

  console.log(conversations)

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchIconClick = () => {
    setSearchBarOpen(!searchBarOpen);
  };

  const handleDeleteConversation = async (fileName) => {
    try {
      const result = await deleteChat(fileName)
      const conversationToDelete = conversations.find(conversation => conversation.fileName === fileName);
      if(result) {
        setConversations(conversations.filter(conversation => conversation.fileName !== fileName));
        setDeletedConversationId(conversationToDelete.id);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const getInitials = (fileName) => {
    return fileName
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase();
  };
  
    const handleConversationClick = (fileName) => {
        navigate(`/chat/${fileName}`);
    };

    const filteredConversations = conversations.filter((conversation) =>
        conversation.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSnackbarClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setSnackbarOpen(false);
    };
  
  return (
    <>{ conversations.length > 0 ? (
    <Container sx={{ paddingBottom:'1%', bgcolor:'lightgray', borderRadius:2}}>
    <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h5" padding={1} component="h5" gutterBottom display="flex" sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>Previous Conversations</Typography>
        </Grid>
        <Grid item>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 1 }}>
            <IconButton onClick={handleSearchIconClick}>
              <SearchIcon />
            </IconButton>
            <Collapse in={searchBarOpen} timeout="auto" unmountOnExit>
              <TextField label="Search" variant="outlined" size="small" value={searchTerm} onChange={handleSearchChange} sx={{ width: '100%', transition: 'width 0.3s' }}/>
            </Collapse>
          </Box>
        </Grid>
      </Grid>
    <Box sx={{display: 'flex', flexDirection: 'row', overflowX: 'scroll', width: '100%', height: '100%'}}> {filteredConversations.map((conversation) => ( <Box key={conversation.id} component="span" marginRight={2}>
        <Paper elevation={3} sx={{ padding: 2, width: 250, height:200, background:"whitesmoke",transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { transform: 'scale(1.05)', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', }, cursor: 'pointer', borderRadius:2}}>
          <Box sx={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <Box sx={{height: '100%', overflowY: 'auto',}}>
              <List>
                <ListItem alignItems="flex-start" onClick={() => handleConversationClick(conversation.fileName)}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'black' }}>{getInitials(conversation.fileName)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={conversation.fileName} secondary={`Message: ${conversation.latestMessage.text}`} />
                </ListItem>
              </List>
            </Box>
            <Divider />
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 1, paddingBottom: 1,}}>
              <Typography variant="caption" color="text.secondary">GPT-4</Typography>
              <Typography variant="caption" color="text.secondary">
                {
                  (() => {
                    const date = moment(conversation.latestMessage.timestamp, 'MMMM DD, YYYY at hh:mm:ss A Z');
                    return date.format('MMM DD, YYYY, hh:mm A');
                  })()
                }
                </Typography>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteConversation(conversation.fileName)}><DeleteIcon /></IconButton>
            </Box>
          </Box>
        </Paper>
      </Box> 
      ))} 
    </Box>
    </Container>
    ) : (<Box></Box>)}
    <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity="success" variant="filled"> Chat deleted</Alert>
    </Snackbar>
    </>
  );
}

export default ConversationList;
