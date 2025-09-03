// background.js - Service worker for the extension

// Persist a single log entry to chrome.storage.local
async function saveLog(entry) {
  try {
    const { logs = [] } = await chrome.storage.local.get(["logs"]);
    logs.push(entry);
    await chrome.storage.local.set({ logs });
  } catch (e) {
    console.error("Failed to save log:", e);
  }
}

// When a tab finishes loading or its URL changes, record a 'visit'
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // 'complete' ensures we wait for final URL and title; also capture explicit URL changes
  if (changeInfo.status === "complete" || changeInfo.url) {
    const url = changeInfo.url || tab.url;
    if (!url || url.startsWith("chrome://") || url.startsWith("edge://")) return;
    const title = tab.title || "";
    const entry = {
      type: "visit",
      url,
      title,
      timestamp: new Date().toISOString()
    };
    await saveLog(entry);
  }
});

// Listen for messages from content scripts / popup to log clicks or handle admin actions
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    try {
      if (msg?.type === "log_click" && msg?.data) {
        await saveLog({
          type: "click",
          url: msg.data.url,
          text: msg.data.text || "",
          pageUrl: msg.data.pageUrl || "",
          timestamp: new Date().toISOString()
        });
        sendResponse({ ok: true });
        return;
      }

      if (msg?.type === "clear_logs") {
        await chrome.storage.local.set({ logs: [] });
        sendResponse({ ok: true });
        return;
      }

      if (msg?.type === "get_logs") {
        const { logs = [] } = await chrome.storage.local.get(["logs"]);
        sendResponse({ ok: true, logs });
        return;
      }
    } catch (e) {
      console.error(e);
      sendResponse({ ok: false, error: String(e) });
    }
  })();

  // Indicate we will respond asynchronously.
  return true;
});
