import { parseJSON, formatJSONToHTML } from '../utils/json-formatter.js';

const inputArea = document.getElementById('input-area');
const outputArea = document.getElementById('output-area');
const formatBtn = document.getElementById('format-btn');
const openTabBtn = document.getElementById('open-tab-btn');

// Auto-focus input
inputArea.focus();

// Try to read selection from active tab if any
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: () => window.getSelection().toString()
        }, (results) => {
            if (results && results[0] && results[0].result) {
                const text = results[0].result.trim();
                if (text) {
                    inputArea.value = text;
                    tryFormat(); // Auto-format if valid
                }
            }
        });
    }
});

formatBtn.addEventListener('click', tryFormat);

function tryFormat() {
    const raw = inputArea.value.trim();
    if (!raw) return;

    try {
        const parsed = parseJSON(raw);
        const html = formatJSONToHTML(parsed);

        inputArea.classList.add('hidden');
        outputArea.innerHTML = html;
        outputArea.classList.remove('hidden');
    } catch (e) {
        // Fallback: don't hide input, show error?
        // Simple visual feedback could be implemented
        inputArea.style.borderColor = '#ff5555';
        setTimeout(() => inputArea.style.borderColor = '#6272a4', 1000);
    }
}

// Allow toggling back to edit
outputArea.addEventListener('dblclick', () => {
    outputArea.classList.add('hidden');
    inputArea.classList.remove('hidden');
    inputArea.focus();
});

openTabBtn.addEventListener('click', () => {
    const raw = inputArea.value.trim();
    if (raw) {
        chrome.storage.local.set({ 'temp_json_data': raw }, () => {
            chrome.tabs.create({ url: 'src/viewer.html' });
        });
    } else {
        chrome.tabs.create({ url: 'src/viewer.html' });
    }
});
