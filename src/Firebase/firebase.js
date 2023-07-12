// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBLjDnlP7iOZCtv7JKoVrdzEpz5FWzCuCs",
  authDomain: "pdf-chat-cc707.firebaseapp.com",
  projectId: "pdf-chat-cc707",
  storageBucket: "pdf-chat-cc707.appspot.com",
  messagingSenderId: "503624257030",
  appId: "1:503624257030:web:dc655c33836cec39017d87",
  measurementId: "G-VVKW2890ZZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export async function getUserSubscriptionStatus(user) {
  const idToken = await auth.currentUser.getIdToken(true);
  const response = await fetch('http://127.0.0.1:5000/api/user/subscription', {
    headers: { 'Authorization': 'Bearer ' + idToken},
  });

  if (response.ok) {
    return await response.json();
  } else {
    console.error(`Error: ${response.status}`);
  }
}


export {auth, db, storage}