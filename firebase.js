// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC7JHfVrDW2KkDHTJVrQE4XZQz9BrIP_C0",
    authDomain: "eventorganizer-9ee65.firebaseapp.com",
    projectId: "eventorganizer-9ee65",
    storageBucket: "eventorganizer-9ee65.appspot.com",
    messagingSenderId: "133829970982",
    appId: "1:133829970982:web:151a4eb0ec0ee8a6712ae7",
    measurementId: "G-368CZND0BH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Authentication
const db = getFirestore(app); // Initialize Firestore

export { auth, db };