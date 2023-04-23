import React, { useState, useEffect } from 'react';
import { auth, db } from '../Firebase/firebase';
import { collection, getDocs, limit, orderBy, query, doc, deleteDoc } from 'firebase/firestore';
import { Avatar, Container, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography, Box, Paper, Grid, IconButton, TextField, InputAdornment, Collapse } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

function ConversationList() {

  const navigate = useNavigate();  
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      if (auth.currentUser) {
        const conversationsRef = collection(db, 'users', auth.currentUser.uid, 'conversations');
        const conversationsSnapshot = await getDocs(conversationsRef);
        const conversationsData = conversationsSnapshot.docs.map(doc => {
          return { id: doc.id, fileName: doc.data().fileName };
        });
  
        const conversationsWithLatestMessage = [];
        for (const conversation of conversationsData) {
          const messagesRef = collection(conversationsRef, conversation.id, 'messages');
          const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
          const lastMessageSnapshot = await getDocs(q);
          const lastMessage = lastMessageSnapshot.docs[0].data();
  
          conversationsWithLatestMessage.push({
            id: conversation.id,
            fileName: conversation.fileName,
            latestMessage: {
              text: lastMessage.text,
              sender: lastMessage.sender,
              timestamp: lastMessage.timestamp,
            },
          });
        }
        const sortedConversations = conversationsWithLatestMessage.sort((a, b) => {
            return b.latestMessage.timestamp.getTime() - a.latestMessage.timestamp.getTime();
          });
        setConversations(sortedConversations);
      }
    };
  
    fetchConversations();
  }, [auth.currentUser]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchIconClick = () => {
    setSearchBarOpen(!searchBarOpen);
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      // Delete all messages in the conversation
      const messagesRef = collection(db, 'users', auth.currentUser.uid, 'conversations', conversationId, 'messages');
      const messagesSnapshot = await getDocs(messagesRef);
      
      for (const messageDoc of messagesSnapshot.docs) {
        await deleteDoc(doc(messagesRef, messageDoc.id));
      }
  
      // Delete the conversation document
      const conversationRef = doc(db, 'users', auth.currentUser.uid, 'conversations', conversationId);
      await deleteDoc(conversationRef);
  
      // Update the UI
      setConversations(conversations.filter(conversation => conversation.id !== conversationId));
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
  
  return (
    <Container sx={{ paddingBottom:'1%', bgcolor:'lightgray', borderRadius:2}}>
    <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h5" padding={1} component="h5" gutterBottom display="flex" sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>
            Previous Conversations
          </Typography>
        </Grid>
        <Grid item>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 1 }}>
            <IconButton onClick={handleSearchIconClick}>
              <SearchIcon />
            </IconButton>
            <Collapse in={searchBarOpen} timeout="auto" unmountOnExit>
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ width: '100%', transition: 'width 0.3s' }}
              />
            </Collapse>
          </Box>
        </Grid>
      </Grid>
    <Box sx={{display: 'flex', flexDirection: 'row', overflowX: 'scroll', width: '100%', height: '100%'}}> {filteredConversations.map((conversation) => ( <Box key={conversation.id} component="span" marginRight={2}>
        <Paper elevation={3} sx={{ padding: 2, width: 250, height:200, background:"whitesmoke",transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    },
                cursor: 'pointer',
                borderRadius:2}}>
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
                    {new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    }).format(conversation.latestMessage.timestamp)}
                </Typography>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteConversation(conversation.id)}><DeleteIcon /></IconButton>
            </Box>
          </Box>
        </Paper>
      </Box> 
      ))} 
    </Box>
    </Container>
    );
}

export default ConversationList;
