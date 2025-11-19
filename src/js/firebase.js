// src/js/firebase.js   ←←← THIS IS THE CORRECT VERSION

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

// ←←← YOUR REAL CONFIG (already correct)
const firebaseConfig = {
  apiKey: "AIzaSyAELQdb0WKFbDF7kRV8iFB3EEuxTcbJSx4",
  authDomain: "hack-8eb52.firebaseapp.com",
  projectId: "hack-8eb52",
  storageBucket: "hack-8eb52.firebasestorage.app",
  messagingSenderId: "254552060276",
  appId: "1:254552060276:web:278e9f2317f6847daf3c21",
  measurementId: "G-HMPSKYJ6T7"
};

const app = initializeApp(firebaseConfig);

// THESE 3 LINES WERE MISSING BEFORE → NOW ADDED
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);