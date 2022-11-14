// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4iUBp2hLdeQ916jbPM6mgRYJ_7EubwmQ",
  authDomain: "movement-8389e.firebaseapp.com",
  projectId: "movement-8389e",
  storageBucket: "movement-8389e.appspot.com",
  messagingSenderId: "403464224112",
  appId: "1:403464224112:web:0e081925ff977a37f1a3b5",
  measurementId: "G-6DY3268D52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);