import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
import ChatBox from './ChatBox';
import { auth, storage } from '../Firebase/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { Document, Page } from '@react-pdf/renderer';

function ChatPage() {
  const { fileName } = useParams();

  const [pdfURL, setPdfURL] = useState("");
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    const userId = auth.currentUser.uid;
    const file = fileName;
    const fileRef = ref(storage, `pdfs/${userId}/${file}`);
    getDownloadURL(fileRef)
      .then((url) => {
        setPdfURL(url);
      })
      .catch((error) => {
        console.error("Error fetching PDF:", error);
      });
  }, [fileName]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <Box sx={{ my: 3, width: '100%', height: '100vh' }}>
      <Grid container spacing={2}>
        <Grid item xs={3} sx={{ height: '100%', overflow: 'hidden' }}>
          <Typography
            variant="h5"
            component="h2"
            color="white"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Processed File: {fileName}
          </Typography>
          <ChatBox fileName={fileName} />
        </Grid>
        <Grid item xs={9} sx={{ height: '100%', overflow: 'auto' }}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Document
              file={pdfURL}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div>Loading...</div>}
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
              ))}
            </Document>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ChatPage;
