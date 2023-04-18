import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Avatar,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  LinearProgress,
  Alert,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Grid,
  IconButton
} from '@mui/material';
import { styled } from '@mui/system';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RobotIcon from '@mui/icons-material/EmojiObjects';
import SendIcon from '@mui/icons-material/Send';
import DragAndDropInput from './DragAndDropInput';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {

    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([])
    const [uploadSuccess, setUploadSucess] = useState(null)
    const [backendTyping, setBackendTyping] = useState(false);
    const chatBoxRef = useRef(null);
    const theme = useTheme();
    const scrollToBottom = () => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      };
    
    const handleFileChange = (file) => {
        setFile(file);
        setFileName(file.name || '');
    };
    
    
    useEffect(() => {
        scrollToBottom();
      }, [chatHistory]);

    const MessageText = styled(ListItemText)(({ theme }) => ({
        '&[messagetype="user"]': {
          backgroundColor: "#859AFA",
          marginRight:theme.spacing(1)
        },
        '&[messagetype="backend"]': {
          backgroundColor: "#B2B2B2",
          marginRight:theme.spacing(1)
        },
        borderRadius: theme.spacing(1),
        padding: theme.spacing(1, 2),
        maxWidth: '70%',
        wordWrap: 'break-word',
      }));
      
    const handleNewMessageChange = (e) => {
        setNewMessage(e.target.value);
    };
    
    const handleRemoveFile = () => {
        setFile(null);
        setFileName('');
        setUploadSucess(null);
        setChatHistory([]);
    };
    
    const handleSendMessage = async () => {
        if (!newMessage) return;
    
        const message = {
          type: 'user',
          text: newMessage,
        };
        setChatHistory([...chatHistory, message]);
        setNewMessage('');
        setBackendTyping(true)
    
        try {
          const response = await axios.post('http://127.0.0.1:5000/api/chat', { message: newMessage });
          console.log(response)
          const backendResponse = {
            type: 'backend',
            text: response.data.answer,
          };
        
          setChatHistory([...chatHistory, message, backendResponse]);
          setBackendTyping(false)
        } catch (error) {
          console.error('Error sending message:', error);
          setBackendTyping(false)
        }
    };
    
    const handleSubmit = async () => {
        if (!file) return;
    
        setLoading(true);
        setError(false);
        setUploadSucess(null)
    
        const formData = new FormData();
        formData.append('pdf', file);
    
        try {
            await axios.post('http://127.0.0.1:5000/api/process-pdf', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          setUploadSucess(true)
        } catch (error) {
          setError(true);
        } finally {
          setLoading(false);
        }
    };

    return (
    <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={10}>
              <Paper elevation={3} sx={{ p: 3, bgcolor:'beige', borderRadius:2 }}>
                <DragAndDropInput onFileChange={handleFileChange} />
                    {fileName && ( <Typography variant="subtitle1" component="p" sx={{ mt: 1 }}>{fileName}</Typography> )}
                {uploadSuccess && ( <Box mt={2}>
                  <Alert severity="success">PDF successfully uploaded and processed</Alert>
                </Box> )} <Box mt={2} display="flex" justifyContent="center">
                  <Button variant="contained" color="secondary" onClick={handleSubmit} disabled={loading}>Process PDF</Button> {file && ( <Button variant="contained" color="error" onClick={handleRemoveFile} sx={{ ml: 1 }}>Remove File</Button> )}
                </Box> {loading && ( <Box mt={2}>
                  <LinearProgress />
                </Box>)} {error && ( <Box mt={2}>
                  <Alert severity="error">Error processing PDF</Alert>
                </Box> )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={10} mt={2}>
              <Paper elevation={3} sx={{p:3, width:650, borderRadius:2, bgcolor:'beige'}}>
                <Paper ref={chatBoxRef} elevation={3} sx={{ p: 3, maxHeight: 600, overflow: 'auto'}}>
                  <List> {chatHistory.map((message, index) => ( <ListItem key={index} alignItems="flex-start" sx={{ flexDirection: message.type === 'user' ? 'row-reverse' : 'row' }}>
                      <ListItemAvatar> {message.type === 'user' ? ( <Avatar><AccountCircleIcon /></Avatar>) 
                      : ( <Avatar><RobotIcon /></Avatar>)} 
                      </ListItemAvatar>
                      <MessageText primary={message.text} messageType={message.type} />
                    </ListItem> ))} {backendTyping && ( <ListItem alignItems="flex-start" sx={{ flexDirection: 'row', marginRight:theme.spacing(1)}}>
                        <Avatar><RobotIcon /></Avatar> <MessageText primary="Typing..." messageType="backend" />
                    </ListItem> )} </List>
                </Paper>
                <Box mt={2} display="flex" alignItems="flex-end">
                  <TextField fullWidth label="Type your message" value={newMessage} onChange={handleNewMessageChange} disabled={!uploadSuccess} variant="outlined" sx={{ mr: 1 }} />
                  <IconButton color="primary" onClick={handleSendMessage} disabled={!uploadSuccess}><SendIcon /></IconButton>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
    </Container>
  );
}

export default Home;
