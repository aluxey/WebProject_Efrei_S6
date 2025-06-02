import { initializeApp } from "firebase/app";
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

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

export {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
};
