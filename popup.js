// popup.js - Displays logs, allows clearing and exporting

function formatLogs(logs) {
  // Ensure most recent first
  const items = [...logs].sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""));
  return JSON.stringify(items, null, 2);
}

async function loadLogs() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "get_logs" }, (res) => {
      if (!res || !res.ok) return resolve([]);
      resolve(res.logs || []);
    });
  });
}

async function refresh() {
  const output = document.getElementById("output");
  const stat = document.getElementById("stat");
  const logs = await loadLogs();
  output.textContent = formatLogs(logs);
  stat.textContent = `${logs.length} entr${logs.length === 1 ? "y" : "ies"} stored locally`;
}

async function clearLogs() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "clear_logs" }, (res) => {
      resolve(!!(res && res.ok));
    });
  });
}

function download(filename, text) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

document.getElementById("refreshBtn").addEventListener("click", refresh);
document.getElementById("clearBtn").addEventListener("click", async () => {
  const ok = await clearLogs();
  if (ok) refresh();
});
document.getElementById("exportBtn").addEventListener("click", async () => {
  const logs = await loadLogs();
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  download(`user-action-logs-${ts}.json`, JSON.stringify(logs, null, 2));
});

// Initial render
refresh();
