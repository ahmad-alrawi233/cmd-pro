import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3fTtqC-u98qhupd2tbre-O_NXG3uJhWs",
  authDomain: "cmd-software.firebaseapp.com",
  projectId: "cmd-software",
  storageBucket: "cmd-software.firebasestorage.app",
  messagingSenderId: "145511109381",
  appId: "1:145511109381:web:f0fd358aafcfd878515d6c",
  measurementId: "G-GBTWES0E3D"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);