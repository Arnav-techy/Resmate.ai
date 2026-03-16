// Extract job description from current page
function extractJobDescription() {
  // Try LinkedIn first
  const linkedinJD = document.querySelector(".job-view-layout .jobs-description");
  if (linkedinJD) return linkedinJD.innerText;

  // Try Internshala
  const internshalaJD = document.querySelector(".internship_details");
  if (internshalaJD) return internshalaJD.innerText;

  // Fallback - get largest text block
  const candidates = ["article", "main", ".job-description", "#job-description"];
  for (const selector of candidates) {
    const el = document.querySelector(selector);
    if (el && el.innerText.length > 200) return el.innerText;
  }

  // Last resort - full page text
  return document.body.innerText;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getJD") {
    sendResponse({ jd: extractJobDescription() });
  }
});