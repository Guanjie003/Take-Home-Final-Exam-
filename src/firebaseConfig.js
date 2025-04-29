// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDadiPJ0PJV9yeHYAlQI0wVPO3p2jJcpBg",
    authDomain: "sm-finance101.firebaseapp.com",
    projectId: "sm-finance101",
    storageBucket: "sm-finance101.firebasestorage.app",
    messagingSenderId: "68405048168",
    appId: "1:68405048168:web:183ae7013f840599879cdd",
    measurementId: "G-J9THCBE8TR"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);