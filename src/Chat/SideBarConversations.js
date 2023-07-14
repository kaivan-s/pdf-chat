import React, { useState, useEffect } from 'react';
import { auth, storage } from '../Firebase/firebase'
import { ref, uploadBytes } from 'firebase/storage';
import { Box, Typography, Divider, LinearProgress, TextField, Link } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import useConversations from './UseConversations';
import DragAndDropInput from '../Chat/DragAndDropInput'
import axios from 'axios';
import moment from 'moment';


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
    
            await axios.post('https://api.docchat.in/api/process-pdf', formData, {
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
    <Box sx={{height:'100vh', width:'16.7vw', flexDirection:'column', display:'flex', bgcolor:'lightgray'}}>
      <Box sx={{padding:1}}>
          <Box sx={{marginTop:1}}> <DragAndDropInput onFileChange={handleFileChange} /></Box>
          {uploadedFileName && (
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}> {uploadedFileName}</Typography>)}
            {loading && (<Box width="100%" mt={2}><LinearProgress color='inherit'/></Box>)}
            <Divider sx={{marginTop:1, marginBottom:1}} variant="middle"></Divider>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', wordWrap: 'break-word', borderRadius:3 }}>
        <TextField variant="outlined" size="small" label="Search PDFs" value={search} onChange={handleSearchChange} sx={{ marginLeft:1, width: '94.5%', marginBottom: 1 }}/>
      {filteredConversations.map((conversation) => (
        <Box
          key={conversation.id}
          onClick={() => handleConversationClick(conversation.fileName)}
          sx={{ border: '1px dotted', borderRadius: 1, padding: 1, margin: 1, cursor: 'pointer', bgcolor: conversation.fileName === fileName ? 'black' : 'rgba(0, 0, 0, 0.1)'}}>
          <Typography sx={{color:conversation.fileName === fileName ? 'white' : 'black',}} variant="subtitle1">{conversation.fileName}</Typography>
          <Typography sx={{color:conversation.fileName === fileName ? 'white' : 'black'}} variant="caption">
          {
                  (() => {
                    const date = moment(conversation.latestMessage.timestamp, 'MMMM DD, YYYY at hh:mm:ss A Z');
                    return date.format('MMM DD, YYYY, hh:mm A');
                  })()
          }
          </Typography>
        </Box>
      ))}
      </Box>
      <Box sx={{padding:2.1, bgcolor:"black", display:'flex', justifyContent:'center', alignItems:'center'}}>
        <Typography variant="subtitle" sx={{color:'White', fontFamily:'TimesNewRoman'}}>
          <Link href="/" color="inherit" underline="hover"> Home Page</Link>{" "}
        </Typography>
      </Box>
    </Box>
  );
}

export default SidebarConversationList;
