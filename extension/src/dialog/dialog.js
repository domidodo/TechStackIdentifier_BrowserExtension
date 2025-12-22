async function loadWikiUrl() {
  const result = await chrome.storage.local.get("config");
  return result?.config?.wikiUrl ?? "https://github.com/domidodo/TechStackIdentifier_BrowserExtension/wiki";
}

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
  
  document.getElementById("btn-settings").addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
  
  const wikiUrl = await loadWikiUrl();
  document.getElementById("btn-docs").addEventListener("click", () => {
  	chrome.tabs.create({
  		url: wikiUrl
  	});
  });
  
  document.getElementById("btn-github").addEventListener("click", () => {
  	chrome.tabs.create({
  		url: "https://github.com/domidodo/TechStackIdentifier_BrowserExtension/"
  	});
  });
}
init();