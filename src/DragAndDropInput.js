import React, { useRef } from 'react';
import { Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const DragAndDropInput = ({ onFileChange }) => {
  const inputRef = useRef();

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    onFileChange(file);
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    onFileChange(file);
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
        border: "2px dashed grey",
        borderRadius: "4px",
        cursor: "pointer",
        bgcolor:"whitesmoke"
      }}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
    >
      <input
        ref={inputRef}
        accept="application/pdf"
        onChange={handleFileInputChange}
        type="file"
        hidden
      />
      <Box sx={{ textAlign: "center" }}>
        <CloudUploadIcon fontSize="large" />
        <Typography variant="body1">
          Click or drag and drop a PDF file here
        </Typography>
      </Box>
    </Box>
  );
};

export default DragAndDropInput;
