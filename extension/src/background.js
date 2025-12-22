async function getConfig() {
  const result = await chrome.storage.local.get("config");
  return result.config || { profiles: {}, domainMapping: {}, exceptions: {} };
}

function findProfileName(hostname, mapping) {
  if (!mapping) return "default";
  if (mapping[hostname]) return mapping[hostname];

  const parts = hostname.split('.');
  while (parts.length > 1) {
    parts.shift();
    const parentDomain = parts.join('.');
    if (mapping[parentDomain]) return mapping[parentDomain];
  }
  return mapping["default"] || null;
}

chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === "update-icon" && sender.tab) {
    const config = await getConfig();
    const url = sender.tab.url;
    const hostname = new URL(url).hostname;
    const content = message.content;
    const tabId = sender.tab.id;

    let match = null;

    if (config.exceptions && config.exceptions[url]) {
      match = config.exceptions[url];
    }

    if (!match) {
      const profileName = findProfileName(hostname, config.domainMapping);
      if (profileName && config.profiles[profileName] && config.profiles[profileName][content]) {
        match = config.profiles[profileName][content];
      }
    }

    const finalData = match || { label: "Unknown", color: "#808080", badge: "?" };

    chrome.action.setBadgeText({ text: finalData.badge, tabId: tabId });
    chrome.action.setBadgeBackgroundColor({ color: finalData.color, tabId: tabId });
    chrome.action.setTitle({ title: JSON.stringify(finalData), tabId: tabId });
  }
});