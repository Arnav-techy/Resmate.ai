const API_URL = "http://127.0.0.1:8000";

const statusEl = document.getElementById("status");
const analyzeBtn = document.getElementById("analyze-btn");
const autofillBtn = document.getElementById("autofill-btn");
const resultsEl = document.getElementById("results");
const jobTitleEl = document.getElementById("job-title");


// Check server health when popup opens
async function checkServer() {
  try {
    const res = await fetch(`${API_URL}/api/v1/health`);

    if (res.ok) {
      setStatus("ready", "✅ Ready to match!");
      analyzeBtn.disabled = false;
    } else {
      setStatus("error", "❌ Backend error");
    }

  } catch {
    setStatus("error", "❌ Server offline. Start backend first.");
  }
}


// Get job description from current tab
async function getJobDescription() {

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  try {

    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {

        // LinkedIn job description (new layouts)
        const linkedinLayout = document.querySelector(".job-view-layout .jobs-description");
        if (linkedinLayout && linkedinLayout.innerText) {
          return linkedinLayout.innerText;
        }

        const linkedin = document.querySelector(".show-more-less-html") || document.querySelector(".jobs-description__content");
        if (linkedin && linkedin.innerText) {
          return linkedin.innerText;
        }

        // Internshala description
        const internshala = document.querySelector(".internship_details");
        if (internshala && internshala.innerText) {
          return internshala.innerText;
        }

        // fallback to common article/main blocks before falling back to entire body
        const candidates = ["article", "main", ".job-description", "#job-description"];
        for (const selector of candidates) {
          const el = document.querySelector(selector);
          if (el && el.innerText.length > 200) return el.innerText;
        }

        return document.body.innerText.slice(0, 3000);

      }
    });

    return result[0].result;

  } catch (err) {

    console.error("JD extraction failed:", err);

    return "";

  }
}


// Analyze Job Button
analyzeBtn.addEventListener("click", async () => {

  setStatus("warming", "🔄 Analyzing...");
  analyzeBtn.disabled = true;

  try {

    // Get stored resume embeddings
    const stored = await chrome.storage.local.get(["embeddings", "filenames"]);

    if (!stored.embeddings) {
      setStatus("error", "❌ No resumes found. Go to Settings.");
      analyzeBtn.disabled = false;
      return;
    }

    setStatus("warming", "🔄 Getting job description...");
    let jd = await getJobDescription();
    
    // Fallback safeguard to prevent 39.6% constant score if string is entirely empty spaces
    if (!jd || jd.trim().length === 0) {
      jd = "No readable job description found on this page.";
    }

    console.log("JD length:", jd.length);
    console.log("JD first 100 chars:", jd.substring(0, 100));

    setStatus("warming", "🔄 Matching resumes...");

    const res = await fetch(`${API_URL}/api/v1/match`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        job_description: jd,
        embeddings: stored.embeddings,
        filenames: stored.filenames
      })
    });

    const data = await res.json();

    console.log("Match result:", data);

    showResults(data.matches);

    setStatus("ready", "✅ Match complete!");

    analyzeBtn.disabled = false;
    autofillBtn.disabled = false;

  } catch (err) {

    console.error("Error:", err);

    setStatus("error", "❌ Error: " + err.message);

    analyzeBtn.disabled = false;
  }

});


// Show resume match results
function showResults(matches) {

  resultsEl.classList.remove("hidden");

  resultsEl.innerHTML = matches.map(m => `
    <div class="match-item">
      <div><strong>${m.filename}</strong></div>
      <div class="confidence-${m.confidence}">
        Score: ${(m.score * 100).toFixed(1)}% • ${m.confidence.toUpperCase()}
      </div>
    </div>
  `).join("");

}


// Status indicator
function setStatus(type, message) {

  statusEl.className = `status ${type}`;
  statusEl.textContent = message;

}


// Initialize popup
checkServer();