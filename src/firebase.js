// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";          // ← Ajouté
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPo-0fM2vzoWiMmrHzhfdKpuexxjqj4cI",
  authDomain: "co2emission-webproject.firebaseapp.com",
  projectId: "co2emission-webproject",
  storageBucket: "co2emission-webproject.firebasestorage.app",
  messagingSenderId: "909956806931",
  appId: "1:909956806931:web:f1969047b38ad1ed0f02e6"
};

const firebaseApp = initializeApp(firebaseConfig);

// Auth
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

// Firestore
const db = getFirestore(firebaseApp);

// Exports (une seule déclaration, sans doublon)
export {
  auth,
  googleProvider,
  db,
  signInWithPopup,
  signOut,
  onAuthStateChanged
};
