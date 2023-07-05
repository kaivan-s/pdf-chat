import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Box, TextField, List, ListItem, ListItemText, ListItemAvatar, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { jsPDF } from 'jspdf';
import { styled } from '@mui/system';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { db, auth } from '../Firebase/firebase'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteIcon from '@mui/icons-material/Delete';
import deleteChat from '../Utilities/DeleteConversation'
import { getDocs, where, limit, collection, addDoc, query } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ChatBackground from '../Images/ChatBackground.jpeg'
import SmartToyIcon from '@mui/icons-material/SmartToy';

function ChatBox({fileName}) {

  const theme = useTheme();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [backendTyping, setBackendTyping] = useState(false);
  const chatBoxRef = useRef(null);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  const fetchConversationMessages = async (uid, fileName) => {
    try {
      const idToken = await auth.currentUser.getIdToken(true);
      const response = await axios.get('http://127.0.0.1:5000/api/conversations/messages', {
        params: {
          uid: uid,
          fileName: fileName
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + idToken
        },
      });
      return response.data;
    } catch (error) {
      return []
    }
};

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (auth.currentUser) {
        const sortedMessages = await fetchConversationMessages(auth.currentUser.uid, fileName.replace(/ /g, '_'));
        console.log(sortedMessages)
        setChatHistory(sortedMessages);
      }
    };
    fetchChatHistory();
  }, [auth.currentUser, fileName]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory.length])

  const boxTheme = createTheme({
    palette: {
      primary: {
        main: 'rgb(255,255,255)' // replace with your desired color
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            "& fieldset": {
              borderColor: "rgb(255,255,255)" // replace with your desired color
            },
            "&:hover fieldset": {
              borderColor: "rgb(255,255,255)" // replace with your desired color
            },
            "&.Mui-focused fieldset": {
              borderColor: "rgb(255,255,255)" // replace with your desired color
            }
          }
        }
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: "rgb(255,255,255)" // replace with your desired color
          }
        }
      }
    }
  });

  const MessageText = styled(ListItemText)(({ theme }) => ({
    '&[messagetype="user"]': {
      backgroundColor: 'rgb(120,120,120)',
      marginRight: theme.spacing(1),
      color:'white'
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

  const handleDownloadChat = () => {
    const doc = new jsPDF({ format: 'a4', unit: 'mm',});
  
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    const paddingLeft = 10;
    const paddingRight = 10;
    const maxWidth = pageWidth - paddingLeft - paddingRight;
  
    const chatData = chatHistory.map(
      (message) =>
        `[${message.type === 'user' ? 'User' : 'GPT-4'}] ${message.text}`
    );
  
    let yOffset = 10;
  
    chatData.forEach((line) => {
      const wrappedText = doc.splitTextToSize(line, maxWidth);
      doc.text(wrappedText, paddingLeft, yOffset);
      yOffset += wrappedText.length * 7;
    });
  
    doc.save(`${fileName}_chat.pdf`);
  };
  

  const TypingIndicator = styled(HourglassEmptyIcon)(({ theme }) => ({
    marginRight: theme.spacing(1),
    fontSize:'2rem',
    animation: 'rotate 1.5s infinite linear',
    '@keyframes rotate': {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
  }));

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleDeleteChat = async () => {
    const success = await deleteChat(fileName);
  
    if (success) {
      navigate("/")
    } else {
      console.error("Error deleting chat");
    }
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
    // saveChatMessage(message);

    try {
      const idToken = await auth.currentUser.getIdToken(true);
      const response = await axios.post('http://127.0.0.1:5000/api/chat', { message: newMessage, backendFile: fileName.replace(/ /g, '_')},
      {
        headers: {
          'Authorization': 'Bearer ' + idToken
        }
      });
      const backendResponse = {
        type: 'backend',
        text: response.data.answer,
      };

      setChatHistory((prevChatHistory) => [...prevChatHistory, backendResponse]);
      setBackendTyping(false);
      //saveChatMessage(backendResponse)
    } catch (error) {
      setBackendTyping(false);
    }
  };

  const colorTheme = createTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: "rgb(255,255,255)",
      },
      secondary: {
        // This is green.A700 as hex.
        main: 'rgb(60,60,60)',
      },
    },
  });
  
  return (
    <Box style={{ height: '100%' }}>
      <Paper elevation={3} sx={{ p: 3, height: '96.5vh', bgcolor: 'rgb(60,60,60)', display: 'flex', flexDirection: 'column', paddingTop:1}}>
      <Box display="flex" justifyContent='space-between' sx={{marginTop:0, backgroundColor:'rgb(60,60,60)',}}>
        <ThemeProvider theme={colorTheme}>
          <Box sx={{margin:1.5}}>
            <Typography variant="h6" color='primary'>{fileName}</Typography>
          </Box>
          <Box>
            <Tooltip title="Download Chat">
              <IconButton color="primary" fontSize='large' onClick={handleDownloadChat}> <GetAppIcon /> </IconButton>
            </Tooltip>
            <Tooltip title="Delete Chat">
              <IconButton color="primary" fontSize='large' onClick={handleDeleteChat}><DeleteIcon /></IconButton>
            </Tooltip>
          </Box>
        </ThemeProvider>
      </Box>
      <Paper ref={chatBoxRef} elevation={3} sx={{ p: 3, flexGrow: 1, height: '100%', overflow: 'auto', marginBottom: theme.spacing(0), paddingTop:0, 
        backgroundImage: `url(${ChatBackground})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', }}>
        <List>
            {chatHistory.map((message, index) => (
              <ListItem key={index} alignItems="flex-start" sx={{ flexDirection: message.type === 'user' ? 'row-reverse' : 'row' }}>
                <ListItemAvatar>
                  {message.type === 'user' ? (
                    <ThemeProvider theme={colorTheme}>
                      <Avatar sx={{bgcolor:'rgb(120,120,120)'}}><AccountCircleIcon color='primary'/></Avatar>
                    </ThemeProvider>
                  ) : (
                    <ThemeProvider theme={colorTheme}>
                      <Avatar sx={{bgcolor:'black'}}><SmartToyIcon color='primary'/></Avatar>
                    </ThemeProvider>
                  )}
                </ListItemAvatar>
                <MessageText primary={message.text} messageType={message.type} />
              </ListItem>
            ))}
            {backendTyping && (
              <ListItem alignItems="flex-start" sx={{ flexDirection: 'row', marginRight:theme.spacing(1)}}>
                <TypingIndicator size={20} />
              </ListItem>
            )}
          </List>
        </Paper>
        <Box mt={3} display="flex" alignItems="flex-end">
          <ThemeProvider theme={boxTheme}>
            <TextField fullWidth  color="primary" label="Type your message" value={newMessage} onChange={handleNewMessageChange} variant="outlined" sx={{ mr: 1 }} 
            InputProps={{style: {color: "white" }}}/>
          </ThemeProvider>
          <ThemeProvider theme={colorTheme}>
            <IconButton color="primary" onClick={handleSendMessage}><SendIcon /></IconButton>
          </ThemeProvider>
        </Box>
      </Paper>
    </Box>
  );
}

export default ChatBox;
