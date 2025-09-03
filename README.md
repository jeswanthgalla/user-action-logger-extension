# User Action Logger (Chrome Extension - Manifest V3)

Logs page visits and link clicks **locally** using `chrome.storage.local`. View, clear, and export logs from the popup.

## What it does
- Records a **visit** when a tab finishes loading (URL + title + timestamp).
- Records a **click** when you click a link on any page (target URL + link text + page URL + timestamp).
- Stores everything locally (`chrome.storage.local`).
- Popup lets you **Refresh**, **Clear Logs**, and **Export JSON**.

## Files
- `manifest.json`: Extension configuration and permissions (MV3).
- `background.js`: Service worker; records visits and handles messages (get/clear/log_click).
- `content.js`: Runs on every page; captures link clicks and sends them to the background.
- `popup.html`: Minimal UI with buttons and a console-like output area.
- `popup.js`: Renders logs, clears storage, and exports as JSON.
- `icons/`: Simple placeholder icons.

## Permissions
- `tabs`: To read the active tab's URL/title after navigation completes.
- `storage`: To save logs locally.
- `host_permissions: <all_urls>`: So content script can run on all pages to capture clicks.

## Load in Chrome (Developer Mode)
1. Go to `chrome://extensions/`.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked** and select the `user-action-logger/` folder.
4. Pin the extension (optional), browse around, click some links, then open the popup to see logs.

## Exporting logs
Click **Export JSON** in the popup; you'll download a file like `user-action-logs-YYYY-MM-DDTHH-MM-SSZ.json`.

## Clear logs
Click **Clear Logs** in the popup; this only affects your local browser storage.

## Privacy
- All data is stored **locally in your browser** via `chrome.storage.local`.
- No remote calls, analytics, or external storage are used.

## Publish to GitHub
1. Create a new repo (or an existing one).
2. From the folder containing `user-action-logger/`, run:
   ```bash
   git init
   git add user-action-logger
   git commit -m "Add User Action Logger (MV3)"
   git branch -M main
   git remote add origin <YOUR_GITHUB_REMOTE_URL>
   git push -u origin main
   ```

## Optional enhancements
- Add filters in the popup (type, domain, date range).
- Add CSV export.
- Add badge text with counts (`chrome.action.setBadgeText`).
- Add a small options page to configure domain allow/deny lists.
