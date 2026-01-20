// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "modern-real-estate-a9aa3.firebaseapp.com",
  projectId: "modern-real-estate-a9aa3",
  storageBucket: "modern-real-estate-a9aa3.firebasestorage.app",
  messagingSenderId: "17296020100",
  appId: "1:17296020100:web:68808b705b81b6995428d1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);