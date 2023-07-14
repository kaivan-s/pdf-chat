import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, IconButton, Drawer } from '@mui/material';
import ChatBox from './ChatBox';
import { auth, storage } from '../Firebase/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ArrowCircleRight from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeft from '@mui/icons-material/ArrowCircleLeft';
import SidebarConversationList from './SideBarConversations';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';


function ChatPage() {
  const { fileName } = useParams();

  const [pdfURL, setPdfURL] = useState("");
  pdfjs.GlobalWorkerOptions.workerSrc =
    `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
;

  useEffect(() => {
    setCurrentPage(1);
    const userId = auth.currentUser.uid;
    const file = fileName;
    const fileRef = ref(storage, `pdfs/${userId}/${file}`);
    getDownloadURL(fileRef)
      .then((url) => {
        const proxyUrl = `https://api.docchat.in/pdf?url=${encodeURIComponent(url)}`;
        setPdfURL(proxyUrl);
      })
      .catch((error) => {
        console.error("Error fetching PDF:", error);
      });
  }, [fileName]);

  useEffect(() => {
    const calculateScale = () => {
      const pdfContainer = document.getElementById('pdfContainer');
      if (!pdfContainer) { return;}
  
      const availableWidth = pdfContainer.clientWidth;
      const availableHeight = pdfContainer.clientHeight;
      const scaleFactorWidth = availableWidth / 600; // Adjust this number based on your layout
      const scaleFactorHeight = availableHeight / 600; // Adjust this number based on your layout
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

  const handleZoomIn = () => {
    setScale(scale * 1.1); // 10% increase
  };

  const handleZoomOut = () => {
    setScale(scale * 0.9); // 10% decrease
  };

  const colorTheme = createTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: "rgb(255,255,255)",
      },
      secondary: {
        // This is green.A700 as hex.
        main: '#11cb5f',
      },
    },
  });
  

  return (
  <Grid container>
      <Grid item xs={12} sm={2}>
        <Drawer variant="permanent">
          <SidebarConversationList key={fileName}/>
        </Drawer>
      </Grid>
      <Grid item xs={12} sm={5}>
        <ChatBox key={fileName} fileName={fileName}/> 
      </Grid>
      <Grid item xs={12} sm={5}>
      <Box sx={{width:'100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',  backgroundColor:'rgb(60,60,60)' }}>
            <ThemeProvider theme={colorTheme}>
                <IconButton onClick={handleZoomOut}><ZoomOutIcon fontSize='large' color='primary'/></IconButton>
                <Box sx={{flexDirection:'row', display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <IconButton onClick={handlePreviousPage}><ArrowCircleLeft fontSize='large' color='primary'/></IconButton>
                  <Typography sx={{color:'white', fontFamily:'TimesNewRoman'}}>Page {`${currentPage} of ${numPages}`}</Typography>
                  <IconButton onClick={handleNextPage}><ArrowCircleRight fontSize='large' color='primary' /></IconButton>
                </Box>
                <IconButton onClick={handleZoomIn}><ZoomInIcon fontSize='large' color='primary'/></IconButton>
              </ThemeProvider>
          </Box>
        <Box id="pdfContainer" sx={{ height: '92vh', overflow: 'auto', border:'10px solid rgb(60,60,60)', backgroundColor:'gray'}}>
          <Box sx={{ overflow:'auto' }}>
            <Document file={pdfURL} onLoadSuccess={onDocumentLoadSuccess} loading={<Typography>Loading...</Typography>}>
              <Page pageNumber={currentPage} scale={scale} />
            </Document>
          </Box>
        </Box>
      </Grid>
    </Grid>
);
}
export default ChatPage;
