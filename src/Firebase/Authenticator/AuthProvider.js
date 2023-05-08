import React from "react";
import { signInWithPopup, OAuthProvider } from "firebase/auth";
import { auth } from '../firebase'
import { IconButton } from "@mui/material";
import GoogleLogo from "../../Images/GoogleIcon.png";
import AppleLogo from "../../Images/AppleLogo.png";

const handleGoogleSignIn = async () => {
  const provider = new OAuthProvider("google.com");
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error(err.message);
  }
};

const handleAppleSignIn = async () => {
  const provider = new OAuthProvider("apple.com");
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error(err.message);
  }
};

const AuthProviderButtons = () => {
  return (
    <>
      <IconButton onClick={handleGoogleSignIn}>
        <img src={GoogleLogo} alt="Google Login" width="40" height="40" />
      </IconButton>
      <IconButton onClick={handleAppleSignIn}>
        <img src={AppleLogo} alt="Apple Login" width="50" height="30" />
      </IconButton>
    </>
  );
};

export default AuthProviderButtons;
