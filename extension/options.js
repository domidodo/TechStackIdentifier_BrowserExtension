const area = document.getElementById('configJson');
const status = document.getElementById('status');

chrome.storage.local.get("config", (res) => {
  const defaultConfig = {
	"profiles": {
		"standard": {
		"S": { "label": "Staging", "color": "#1E90FF", "badge": "STG" },
		"P": { "label": "Production", "color": "#FF0000", "badge": "PRD" }
		}
	},
	"domainMapping": {
		"default": "standard",
		"example.com": "standard"
	},
	exceptions: {
	  "https://example.com/special": { 
        "label": "Exception", "color": "#000", "badge": "EX" 
      }
	}
  };
  area.value = JSON.stringify(res.config || defaultConfig, null, 2);
});

document.getElementById('save').onclick = () => {
  try {
    const json = JSON.parse(area.value);
    chrome.storage.local.set({ config: json }, () => {
      status.textContent = "Settings saved successfully!";
      setTimeout(() => { status.textContent = ""; }, 3000);
    });
  } catch (e) {
    alert("Invalid JSON format! Please check your input.");
  }
};