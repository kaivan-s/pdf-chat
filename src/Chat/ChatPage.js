import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, IconButton, Drawer } from '@mui/material';
import ChatBox from './ChatBox';
import { auth, storage } from '../Firebase/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import SidebarConversationList from './SideBarConversations';


function ChatPage() {
  const { fileName } = useParams();

  const [pdfURL, setPdfURL] = useState("");
  pdfjs.GlobalWorkerOptions.workerSrc =
    `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [numPages, setNumPages] = useState(null);
  const [showPdf, setShowPdf] = useState(true);
  const [scale, setScale] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      const availableWidth = window.innerWidth * 0.5; // Adjust this value based on your layout
      const scaleFactor = availableWidth / 800; // Adjust this number based on your layout
      setScale(scaleFactor);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    const userId = auth.currentUser.uid;
    const file = fileName;
    const fileRef = ref(storage, `pdfs/${userId}/${file}`);
    getDownloadURL(fileRef)
      .then((url) => {
        const proxyUrl = `http://localhost:5001/pdf?url=${encodeURIComponent(url)}`;
        setPdfURL(proxyUrl);
      })
      .catch((error) => {
        console.error("Error fetching PDF:", error);
      });
  }, [fileName]);

  useEffect(() => {
    const calculateScale = () => {
      const availableHeight = window.innerHeight;
      const scaleFactor = availableHeight / 1000; // Adjust this number based on your layout
      setScale(scaleFactor);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  useEffect(() => {
    const calculateScale = () => {
      const pdfContainer = document.getElementById('pdfContainer');
      if (!pdfContainer) { return;}
  
      const availableWidth = pdfContainer.clientWidth;
      const availableHeight = pdfContainer.clientHeight;
      const scaleFactorWidth = availableWidth / 800; // Adjust this number based on your layout
      const scaleFactorHeight = availableHeight / 1000; // Adjust this number based on your layout
      setScale(Math.min(scaleFactorWidth, scaleFactorHeight));
    };
  
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleNextPage = () => {
    if (currentPage < numPages) setCurrentPage(currentPage + 1);
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleTogglePdf = () => {
    setShowPdf(!showPdf);
  };

  return (
    <Box sx={{ width: '100vw', height: '85vh', overflow: 'hidden',  justifyContent:'right', marginTop:6 }}>
    <Grid container spacing={1} sx={{ height: '93%', display: 'flex', flexDirection: 'row' }}>
      <Grid item xs={2} sx={{ overflow: 'auto' }}>
          <Drawer variant="permanent" sx={{ marginTop:2, width: '14vw', flexShrink: 0, [`& .MuiDrawer-paper`]: {width: '14vw',boxSizing: 'border-box'}, bgcolor:'lightgray', borderRadius:3}}>
            <SidebarConversationList key={fileName}/>
          </Drawer>
      </Grid>
      <Grid item xs={showPdf ? 5 : 9.5} sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto'}}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', p: 1 }}>
          <Typography variant="h6" component="p" sx={{ display:'flex-start', fontWeight:'bold', color:'white', marginTop:0, marginLeft:2, marginRight:2, fontFamily:'TimesNewRoman' }}> View PDF : </Typography>
            <Tooltip title="Toggle PDF Viewer">
              <FormControlLabel control={ <Switch checked={showPdf} onChange={handleTogglePdf} name="showPdf" color="default" />}></FormControlLabel>
            </Tooltip>
          </Box>
        <ChatBox key={fileName} fileName={fileName}/>
      </Grid>
        <Grid item xs={5} sx={{ width: "100%", height: '90vh', overflow: 'auto', position: 'relative', display: 'flex', flexDirection: 'column'}}>
          <Box id="pdfContainer" sx={{ width: '100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', borderRadius:3 }}>
          {showPdf && (
            <Box sx={{ width: '100%', display:'flex', flexDirection:'column', alignItems:'center', borderRadius:3 }}>
              <Typography variant="h6" component="p" sx={{ fontWeight:'bold', color:'white', marginTop:0, marginBottom:2 }}> {fileName} </Typography>
              <Document file={pdfURL} onLoadSuccess={onDocumentLoadSuccess} loading={<Typography sx={{color:'white'}}>Loading...</Typography>}> <Page pageNumber={currentPage} scale={scale} /></Document>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, width: '60%' }}>
                <IconButton sx={{ fontSize: '2em', fontWeight:'bold' }} onClick={handlePreviousPage} disabled={currentPage === 1}><ArrowBackIcon /></IconButton>
                <Typography sx={{ fontWeight: 'bold', fontFamily:'TimesNewRoman'}} fontSize="1.5em" >{`${currentPage} of ${numPages}`}</Typography>
                <IconButton sx={{ fontSize: '2em', fontWeight:'bold' }} onClick={handleNextPage} disabled={currentPage === numPages}><ArrowForwardIcon /></IconButton>
              </Box>
            </Box>
          )}
          </Box>
        </Grid>
    </Grid>
  </Box>
);
}

export default ChatPage;
