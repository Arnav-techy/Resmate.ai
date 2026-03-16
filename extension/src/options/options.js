const API_URL = "http://127.0.0.1:8000";

// Show already saved resumes on page load
async function loadSavedResumes() {
  const stored = await chrome.storage.local.get(["filenames"]);
  if (stored.filenames) {
    showResumeList(stored.filenames);
  }
}

function showResumeList(filenames) {
  const list = document.getElementById("resume-list");
  list.innerHTML = `
    <h3 style="margin-bottom:8px; font-size:14px; color:#888;">
      Saved Resumes (${filenames.length})
    </h3>
    ${filenames.map(f => `
      <div class="resume-item">📄 ${f}</div>
    `).join("")}
  `;
}

async function uploadResumes() {
  const fileInput = document.getElementById("file-input");
  const files = fileInput.files;

  if (files.length === 0) {
    setStatus("error", "❌ Please select PDF files first.");
    return;
  }

  if (files.length > 5) {
    setStatus("error", "❌ Maximum 5 resumes allowed.");
    return;
  }

  setStatus("loading", "⚙️ Processing resumes...");

  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }

  try {
    const res = await fetch(`${API_URL}/api/v1/upload`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    await chrome.storage.local.set({
      embeddings: data.embeddings,
      filenames: data.filenames
    });

    showResumeList(data.filenames);
    setStatus("success", `✅ ${data.filenames.length} resumes processed and saved locally!`);

  } catch (err) {
    setStatus("error", "❌ Failed. Is the backend running?");
  }
}

async function clearData() {
  await chrome.storage.local.clear();
  document.getElementById("resume-list").innerHTML = "";
  setStatus("success", "✅ All data cleared.");
}

function setStatus(type, message) {
  const el = document.getElementById("status");
  el.className = type;
  el.textContent = message;
}

// Event listeners
document.getElementById("upload-area").addEventListener("click", () => {
  document.getElementById("file-input").click();
});
document.getElementById("upload-btn").addEventListener("click", uploadResumes);
document.getElementById("clear-btn").addEventListener("click", clearData);

// Load on page open
loadSavedResumes();