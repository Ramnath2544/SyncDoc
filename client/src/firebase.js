// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'blog-app-d0ef4.firebaseapp.com',
  projectId: 'blog-app-d0ef4',
  storageBucket: 'blog-app-d0ef4.firebasestorage.app',
  messagingSenderId: '361696075720',
  appId: '1:361696075720:web:85c317c654d7b9b66e2afd'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);