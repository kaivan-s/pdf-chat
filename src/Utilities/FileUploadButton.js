import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { storage, auth } from '../Firebase/firebase';
import { ref, uploadBytes } from 'firebase/storage';

function FileUploadButton() {
  const navigate = useNavigate();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const userId = auth.currentUser.uid;
    const fileRef = ref(storage, `pdfs/${userId}/${file.name}`);
    await uploadBytes(fileRef, file);
    navigate(`/chat/${file.name}`);
  };

  return (
    <input
      accept="application/pdf"
      id="upload-button"
      type="file"
      style={{ display: 'none' }}
      onChange={handleFileUpload}
    />
  );
}

export default FileUploadButton;
