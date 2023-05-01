import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Paper,
  LinearProgress,
  Alert,
  Grid
} from '@mui/material';
import DragAndDropInput from '../Chat/DragAndDropInput';
import { useNavigate } from 'react-router-dom';
import ConversationList from '../Chat/ConversationList';
import { ref, uploadBytes } from 'firebase/storage';
import { storage, auth } from '../Firebase/firebase'

function Home() {

    const navigate = useNavigate();
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [uploadSuccess, setUploadSucess] = useState(null)
    const chatBoxRef = useRef(null);
    const scrollToBottom = () => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      };
    
    const handleFileChange = (file) => {

        setFileName(file.name || '');
        setFile(file);
        setUploadSucess(null);
        handleSubmit(file, file.name);
    };
    
    
    useEffect(() => {
        scrollToBottom();
      }, []);
      
    const handleSubmit = async (uploadedFile, currentFileName) => {
        if (!uploadedFile) return;
    
        setLoading(true);
        setError(false);
        setUploadSucess(null)
    
        const formData = new FormData();
        formData.append('pdf', uploadedFile);
    
        try {
            await axios.post('http://127.0.0.1:5000/api/process-pdf', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          const userId = auth.currentUser.uid;
          const fileRef = ref(storage, `pdfs/${userId}/${currentFileName}`);
          await uploadBytes(fileRef, uploadedFile);
          setUploadSucess(true)
          navigate(`/chat/${currentFileName}`)
        } catch (error) {
          setError(true);
        } finally {
          setLoading(false);
        }
    };

    return (
      <Box sx={{minHeight:'100vh'}}>
          <Box sx={{ my: 6}}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={8} md={8}>
              <Paper elevation={3} sx={{ p: 2, bgcolor: '#cdcdd4', borderRadius: 2, width: '96.5%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <DragAndDropInput onFileChange={handleFileChange}/>
                  {fileName && ( <Typography variant="h6" component="p" sx={{ mt: 2, fontWeight:'bold' }}>{fileName}</Typography>)}
                  {loading && (<Box width="100%" mt={2}><LinearProgress color='inherit'/></Box>)}
                  {uploadSuccess && ( <Box mt={2}> <Alert severity="success">PDF successfully uploaded and processed</Alert> </Box> )}
                  {error && ( <Box mt={2}> <Alert severity="error">Error processing PDF</Alert> </Box>)}
                </Paper>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{my:5}}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={10} md={8}>
              <ConversationList />
            </Grid>
          </Grid>
          </Box>
      </Box>
  );
}

export default Home;
