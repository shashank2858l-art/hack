// src/js/firebase.js   ←←← THIS IS THE CORRECT VERSION

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

// ←←← YOUR REAL CONFIG (already correct)
const firebaseConfig = {
  apiKey: "****************",
  authDomain: "*********",
  projectId: "*********",
  storageBucket: "*****************",
  messagingSenderId: "***********",
  appId: "***********:web:************",
  measurementId: "***********"
};

const app = initializeApp(firebaseConfig);

// THESE 3 LINES WERE MISSING BEFORE → NOW ADDED
export const auth = getAuth(app);
export const db = getFirestore(app);

export const storage = getStorage(app);
