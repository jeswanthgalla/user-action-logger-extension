// content.js - Runs in the context of each page to capture link clicks

function findLinkTarget(el) {
  // Walk up the DOM to find a parent <a> if the click is on a child element
  while (el && el !== document && el.tagName !== "A") {
    el = el.parentElement;
  }
  return el && el.tagName === "A" ? el : null;
}

document.addEventListener("click", (evt) => {
  const link = findLinkTarget(evt.target);
  if (!link) return;
  try {
    const href = link.href || link.getAttribute("href") || "";
    if (!href) return;

    // Prepare a succinct text label (trim whitespace, cap length)
    const text = (link.innerText || link.textContent || "").trim().slice(0, 200);

    chrome.runtime.sendMessage({
      type: "log_click",
      data: {
        url: href,
        text,
        pageUrl: location.href
      }
    });
  } catch (e) {
    // Fail silently to avoid breaking page behavior
    console.warn("Failed to send click log:", e);
  }
}, true); // use capture phase to catch early
