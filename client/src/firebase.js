import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔹 Paste your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyDDlOkVTwWmZ_kwa0hB9YEcziKZgA7h_xk",
  authDomain: "campus-connect-70aea.firebaseapp.com",
  projectId: "campus-connect-70aea",
  storageBucket: "campus-connect-70aea.firebasestorage.app",
  messagingSenderId: "9532420171",
  appId: "1:9532420171:web:3b936487f61411c3dc5dce",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
