import { parseJSON, formatJSONToHTML } from '../utils/json-formatter.js';

const contentDiv = document.getElementById('content');

// Load data from storage
chrome.storage.local.get(['temp_json_data'], (result) => {
    const raw = result.temp_json_data;
    if (raw) {
        try {
            const parsed = parseJSON(raw);
            const html = formatJSONToHTML(parsed);
            contentDiv.innerHTML = html;
        } catch (e) {
            contentDiv.innerText = "Error parsing JSON: " + e.message;
            contentDiv.style.color = "#ff5555";
        }

        // Optionally clear storage to keep it clean, 
        // but maybe keeping it allows refresh to work?
        // Let's keep it for now.
    } else {
        contentDiv.innerText = "No JSON data found to display.";
    }
});
