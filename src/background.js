// Background Service Worker

// Create Context Menu on installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "format-json-parent",
        title: "JSON Morph",
        contexts: ["selection"]
    });

    chrome.contextMenus.create({
        parentId: "format-json-parent",
        id: "format-json-embedded",
        title: "Show Embedded (Overlay)",
        contexts: ["selection"]
    });

    chrome.contextMenus.create({
        parentId: "format-json-parent",
        id: "format-json-newtab",
        title: "Show in New Tab",
        contexts: ["selection"]
    });
});

// Handle Context Menu Clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "format-json-embedded") {
        sendMessageToContentScript(tab.id, "show-embedded", info.selectionText);
    } else if (info.menuItemId === "format-json-newtab") {
        openInNewTab(info.selectionText);
    }
});

// Helper function injected to get selection, supporting Shadow DOM
function getSelectionDeep() {
    let text = window.getSelection().toString();
    if (text) return text;

    // Try to find active shadow root
    let active = document.activeElement;
    while (active && active.shadowRoot) {
        if (active.shadowRoot.getSelection) {
            const shadowText = active.shadowRoot.getSelection().toString();
            if (shadowText) return shadowText;
        }
        active = active.shadowRoot.activeElement;
    }
    return "";
}

// Handle Keyboard Commands
chrome.commands.onCommand.addListener((command) => {
    if (command === "format-selection") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    function: getSelectionDeep
                }, (results) => {
                    if (results && results[0] && results[0].result) {
                        sendMessageToContentScript(tabs[0].id, "show-embedded", results[0].result);
                    }
                });
            }
        });
    }
});

function sendMessageToContentScript(tabId, action, text) {
    chrome.tabs.sendMessage(tabId, { action: action, text: text }).catch(err => {
        console.warn("Could not send message to content script. Is it loaded?", err);
    });
}

function openInNewTab(jsonText) {
    chrome.storage.local.set({ 'temp_json_data': jsonText }, () => {
        chrome.tabs.create({ url: 'src/viewer.html' });
    });
}
