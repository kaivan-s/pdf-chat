import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Avatar,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Grid,
  IconButton,
  Paper
} from '@mui/material';
import { styled } from '@mui/system';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RobotIcon from '@mui/icons-material/EmojiObjects';
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '@mui/material';
import { db, auth } from '../Firebase/firebase'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { getDocs, where, limit, collection, addDoc, query, Timestamp } from 'firebase/firestore';

function ChatBox({fileName}) {

  const theme = useTheme();
  const [newMessage, setNewMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [backendTyping, setBackendTyping] = useState(false);
  const chatBoxRef = useRef(null);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (auth.currentUser) {
        const conversationsRef = collection(
          db,
          'users',
          auth.currentUser.uid,
          'conversations'
        );
        const conversationQuery = query(
          conversationsRef,
          where('fileName', '==', fileName),
          limit(1)
        );
        const matchingConversations = await getDocs(conversationQuery);
  
        if (!matchingConversations.empty) {
          const conversationId = matchingConversations.docs[0].id;
          const messagesRef = collection(
            conversationsRef,
            conversationId,
            'messages'
          );
          const messagesSnapshot = await getDocs(messagesRef);
  
          const messages = messagesSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              type: data.sender,
              text: data.text,
              timestamp: new Date(data.timestamp)
            };
          });
  
          messages.sort((a, b) => a.timestamp - b.timestamp);
          const sortedMessages = messages.map(({ type, text }) => ({ type, text }));
          setChatHistory(sortedMessages);
        }
      }
    };
    fetchChatHistory();
  }, [auth.currentUser, fileName]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory.length])

  const MessageText = styled(ListItemText)(({ theme }) => ({
    '&[messagetype="user"]': {
      backgroundColor: 'lightgray',
      marginRight: theme.spacing(1)
    },
    '&[messagetype="backend"]': {
      backgroundColor: 'black',
      color:'white',
      marginRight: theme.spacing(1)
    },
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1, 2),
    maxWidth: '70%',
    wordWrap: 'break-word',
  }));

  const TypingIndicator = styled(HourglassEmptyIcon)(({ theme }) => ({
    marginRight: theme.spacing(1),
    fontSize:'2rem',
    animation: 'rotate 1.5s infinite linear',
    '@keyframes rotate': {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
  }));

  const saveChatMessage = async (message) => {
    if (auth.currentUser) {
      const conversationsRef = collection(db, 'users', auth.currentUser.uid, 'conversations');
      const conversationQuery = query(conversationsRef, where('fileName', '==', fileName), limit(1));
      const matchingConversations = await getDocs(conversationQuery);
      let conversationId;
  
      if (matchingConversations.empty) {
        // create a new conversation document
        const newConversationRef = await addDoc(conversationsRef, {
          fileName: fileName
        });
        conversationId = newConversationRef.id;
      } else {
        conversationId = matchingConversations.docs[0].id;
      }
  
      const messagesRef = collection(conversationsRef, conversationId, 'messages');
      console.log("Successfully stored")
      await addDoc(messagesRef, {
        text: message.text,
        sender: message.type,
        timestamp: new Date().getTime()
      });
      console.log(new Date().getTime())
    } else {
      console.error('User not logged in');
    }
  }
  

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!newMessage) return;

    const message = {
      type: 'user',
      text: newMessage,
    };
    setNewMessage('');
    setBackendTyping(true)
    setChatHistory((prevChatHistory) => [...prevChatHistory, message]);
    saveChatMessage(message);

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/chat', { message: newMessage });
      const backendResponse = {
        type: 'backend',
        text: response.data.answer,
      };

      setChatHistory((prevChatHistory) => [...prevChatHistory, backendResponse]);
      setBackendTyping(false);
      saveChatMessage(backendResponse)
    } catch (error) {
      setBackendTyping(false);
    }
  };

  return (
    <Grid item xs={12} md={12} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems:'flex-end'}}>
    <Paper elevation={3} sx={{ p: 3, width: '92.5%', height: '80vh', borderRadius: 3, bgcolor: 'lightgray', display: 'flex', flexDirection: 'column', paddingTop:1}}>
      <Paper ref={chatBoxRef} elevation={3} sx={{ p: 3, flexGrow: 1, height: '100%', overflow: 'auto', marginBottom: theme.spacing(0), bgcolor:'#FAF9F6' }}>
        <List>
            {chatHistory.map((message, index) => (
              <ListItem key={index} alignItems="flex-start" sx={{ flexDirection: message.type === 'user' ? 'row-reverse' : 'row' }}>
                <ListItemAvatar>
                  {message.type === 'user' ? (
                    <Avatar><AccountCircleIcon /></Avatar>
                  ) : (
                    <Avatar><RobotIcon /></Avatar>
                  )}
                </ListItemAvatar>
                <MessageText primary={message.text} messageType={message.type} />
              </ListItem>
            ))}
            {backendTyping && (
              <ListItem alignItems="flex-start" sx={{ flexDirection: 'row', marginRight:theme.spacing(1)}}>
                {/* <Avatar><RobotIcon /></Avatar> */}
                <TypingIndicator size={20} />
              </ListItem>
            )}
          </List>
        </Paper>
        <Box mt={3} display="flex" alignItems="flex-end">
          <TextField fullWidth label="Type your message" value={newMessage} onChange={handleNewMessageChange} variant="outlined" sx={{ mr: 1 }} />
          <IconButton color="default" onClick={handleSendMessage}><SendIcon /></IconButton>
        </Box>
      </Paper>
    </Grid>
  );
}

export default ChatBox;