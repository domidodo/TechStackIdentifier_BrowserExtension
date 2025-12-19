function sendTechInfo() {
  const meta = document.querySelector('meta[name="company:tech"]');
  chrome.runtime.sendMessage({ 
    type: "update-icon", 
    content: meta ? meta.content : null 
  });
}

sendTechInfo();

let lastContent = null;
const observer = new MutationObserver(() => {
  const meta = document.querySelector('meta[name="company:tech"]');
  const currentContent = meta ? meta.content : null;
  if (currentContent !== lastContent) {
    lastContent = currentContent;
    sendTechInfo();
  }
});
observer.observe(document.head, { childList: true, subtree: true });