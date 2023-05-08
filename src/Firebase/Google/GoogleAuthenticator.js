import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const googleSignIn = async (navigate) => {
  const provider = new GoogleAuthProvider();
  
  try {
    const result = await signInWithPopup(auth, provider);
    navigate('/');
    return result;
  } catch (error) {
    console.error("Error during Google Sign-In", error);
    throw error;
  }
};