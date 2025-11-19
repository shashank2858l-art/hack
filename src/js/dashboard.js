import { auth, db } from "./firebase.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { callGemini } from "./gemini.js";

const chat = document.getElementById("chat");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const fileInput = document.getElementById("fileInput");
const voiceBtn = document.getElementById("voiceBtn");
const cameraBtn = document.getElementById("cameraBtn");
const video = document.getElementById("camera");

onAuthStateChanged(auth, (user) => {
  if (!user) location.href = "../auth/login.html";
});

document.getElementById("logout").onclick = () => signOut(auth).then(() => location.href = "../../public/index.html");

function addMessage(text, isUser = false) {
  const div = document.createElement("div");
  div.className = `chat ${isUser ? "chat-end" : "chat-start"}`;
  div.innerHTML = `
    <div class="chat-image avatar">
      <div class="w-10 rounded-full">
        <img src="${isUser ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=User' : 'https://api.dicebear.com/7.x/bottts/svg?seed=AI'}"/>
      </div>
    </div>
    <div class="chat-bubble ${isUser ? 'chat-bubble-primary' : ''}">${marked.parse(text)}</div>
  `;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const text = messageInput.value.trim();
  const files = Array.from(fileInput.files);

  if (!text && files.length === 0) return;

  addMessage(text || "📎 " + files.map(f => f.name).join(", "), true);
  messageInput.value = "";
  fileInput.value = "";

  const loading = document.createElement("div");
  loading.className = "chat chat-start";
  loading.innerHTML = `<div class="chat-bubble">Thinking... <span class="loading loading-dots"></span></div>`;
  chat.appendChild(loading);

  try {
    const response = await callGemini(text, files);
    chat.removeChild(loading);
    addMessage(response);
  } catch (err) {
    chat.removeChild(loading);
    addMessage("❌ Error: " + err.message);
  }
}

sendBtn.onclick = sendMessage;
messageInput.addEventListener("keypress", e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage()));

// Voice Input
voiceBtn.onclick = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.onresult = (e) => {
    messageInput.value = e.results[0][0].transcript;
  };
  recognition.start();
};

// Camera Capture
cameraBtn.onclick = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.classList.remove("hidden");

    setTimeout(() => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      canvas.toBlob(blob => {
        const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInput.files = dt.files;
        addMessage("📸 Photo captured and attached!", true);
      });
      stream.getTracks().forEach(t => t.stop());
      video.classList.add("hidden");
    }, 3000);
  } catch (err) {
    alert("Camera access denied");
  }
};

// Add marked.js for nice formatting
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
document.head.appendChild(script);