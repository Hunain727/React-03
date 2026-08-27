// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfyo8pBvJQv7srILWxDiifqckcUxfZXoc",
  authDomain: "todofirebase-1558a.firebaseapp.com",
  projectId: "todofirebase-1558a",
  storageBucket: "todofirebase-1558a.firebasestorage.app",
  messagingSenderId: "25340153915",
  appId: "1:25340153915:web:a566b5853abddcb7fb8c1e",
  measurementId: "G-E4LM1D51S4"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);