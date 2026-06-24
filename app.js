  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
  import { getDatabase } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

  const firebaseConfig = {
    apiKey: "AIzaSyASHuIcd2pWtD9YOBiTkYL2U1C5AaP1urQ",
    authDomain: "e-commerce-website-61075.firebaseapp.com",
    projectId: "e-commerce-website-61075",
    storageBucket: "e-commerce-website-61075.firebasestorage.app",
    messagingSenderId: "403566925258",
    appId: "1:403566925258:web:22e4d8bd9c26f83d73eb33",
    measurementId: "G-02R5HCC7EY",
    databaseURL:  "https://e-commerce-website-61075-default-rtdb.firebaseio.com/"
  };

  // Initialize Firebase
export const app = initializeApp(firebaseConfig); 
export const auth = getAuth(app);                
export const db = getDatabase(app);            


