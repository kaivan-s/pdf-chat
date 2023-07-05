// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { doc, getDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export async function getUserSubscription(user) {
  const docRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().subscribed;
  } else {
    console.log('No such document!');
    return false;
  }
}

export {auth, db, storage}