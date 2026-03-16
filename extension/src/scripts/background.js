const API_URL = "http://127.0.0.1:8000";

// Ping server every 5 minutes to keep model warm
function pingServer() {
  fetch(`${API_URL}/api/v1/health`)
    .then(() => console.log("Server warm"))
    .catch(() => console.log("Server cold"));
}

// Ping on install
chrome.runtime.onInstalled.addListener(() => {
  pingServer();
});

// Ping every 5 minutes
setInterval(pingServer, 5 * 60 * 1000);