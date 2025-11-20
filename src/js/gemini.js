export async function callGemini(prompt, files = []) {
  const GEMINI_API_KEY = "Add genimi api here";

  let parts = [{ text: `You are an expert academic assistant. Help the student with summaries, study plans, doubt clearing, and explanations.\n\nUser: ${prompt}` }];

  for (const file of files) {
    if (file.type.startsWith("image/") || file.type === "application/pdf" || file.type.includes("text")) {
      const base64 = await fileToBase64(file);
      parts.push({
        inline_data: {
          mime_type: file.type,
          data: base64.split(',')[1]  // Remove data:xxx;base64, prefix
        }
      });
      // Also add a note that file was uploaded
      parts.push({ text: `\n\n(The user also uploaded a ${file.type.startsWith("image/") ? "photo/image" : "document/file"} named "${file.name}")` });
    }
  }

  // OFFICIAL WORKING MODEL NOVEMBER 2025
  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts }]
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.candidates[0].content.parts[0].text;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

}
