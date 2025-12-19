async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.action.getTitle({ tabId: tab.id }, (titleStr) => {
	if (titleStr.startsWith("{")) {
      const box = document.getElementById('box');
      try {
        const data = JSON.parse(titleStr);
        box.textContent = data.label;
        box.style.backgroundColor = data.color;
        box.style.color = "white";
      } catch(e) { 
        box.textContent = "No Environment Detected";
        box.style.backgroundColor = "#eee";
        box.style.color = "#666";
      }
	}
  });

  document.getElementById('opts').onclick = () => {
    chrome.runtime.openOptionsPage();
  };
}
init();