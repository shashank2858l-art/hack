import { auth } from "./firebase.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const isSignup = location.pathname.includes("signup");

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) return alert("Please fill email and password");

  try {
    if (isSignup) {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("🎉 Account created successfully!");
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
    location.href = "../dashboard/index.html";
  } catch (error) {
    console.error(error);
    alert("Error: " + error.message);
  }
});