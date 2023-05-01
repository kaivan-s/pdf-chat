import React, { useState, useEffect } from 'react';
import { auth, storage } from '../Firebase/firebase'
import { ref, uploadBytes } from 'firebase/storage';
import { Box, Typography, Divider, LinearProgress, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import useConversations from './UseConversations';
import DragAndDropInput from '../Chat/DragAndDropInput'
import axios from 'axios';


function SidebarConversationList() {
    const navigate = useNavigate();
    const conversations = useConversations();
    const { fileName } = useParams();
  
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState('');

  const [search, setSearch] = useState('');

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredConversations = conversations.filter((conversation) =>
    conversation.fileName.toLowerCase().includes(search.toLowerCase())
  );

  
    const handleFileChange = (file) => {
      setUploadedFileName(file.name || '');
      setFile(file);
    };
  
    const handleRemoveFile = () => {
      setFile(null);
      setUploadedFileName('');
    };

    useEffect(() => {
        if (!file) return;
        setLoading(true)
        const uploadFile = async () => {
          try {
            const formData = new FormData();
            formData.append('pdf', file);
    
            await axios.post('http://127.0.0.1:5000/api/process-pdf', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            const userId = auth.currentUser.uid;
            const fileRef = ref(storage, `pdfs/${userId}/${uploadedFileName}`);
            await uploadBytes(fileRef, file);
    
            handleRemoveFile();
            navigate(`/chat/${uploadedFileName}`);
            setLoading(false)
          } catch (error) {
            console.error('Error uploading PDF:', error);
          }
        };
    
        uploadFile();
      }, [file]);
  
    const handleConversationClick = (fileName) => {
      navigate(`/chat/${fileName}`);
    };

  return (
    <Box sx={{height:'93vh', overflowY:'auto', overflowX:'hidden', bgcolor:'lightgray', wordWrap:'break-word'}}>
        <Box sx={{width:'13vw', marginTop:1, marginLeft:1}}> <DragAndDropInput onFileChange={handleFileChange} /></Box>
      {uploadedFileName && (
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}> {uploadedFileName}</Typography>)}
        {loading && (<Box width="100%" mt={2}><LinearProgress color='inherit'/></Box>)}
        <Divider sx={{marginTop:1, marginBottom:1}} variant="middle"></Divider>
        <TextField variant="outlined" size="small" label="Search PDFs" value={search} onChange={handleSearchChange} sx={{ marginLeft:1, width: '94.5%', marginBottom: 1 }}/>
      {filteredConversations.map((conversation) => (
        <Box
          key={conversation.id}
          onClick={() => handleConversationClick(conversation.fileName)}
          sx={{ border: '1px dotted', borderRadius: 1, padding: 1, margin: 1, cursor: 'pointer', bgcolor: conversation.fileName === fileName ? 'black' : 'rgba(0, 0, 0, 0.1)'}}>
          <Typography sx={{color:conversation.fileName === fileName ? 'white' : 'black',}} variant="subtitle1">{conversation.fileName}</Typography>
          <Typography sx={{color:conversation.fileName === fileName ? 'white' : 'black'}} variant="caption">
            {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',}).format(conversation.latestMessage.timestamp)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default SidebarConversationList;
