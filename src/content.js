// Content Script

let stylesLoaded = false;

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "show-embedded") {
        handleShowEmbedded(request.text);
    }
});

async function handleShowEmbedded(text) {
    try {
        const src = chrome.runtime.getURL('utils/json-formatter.js');
        const module = await import(src);
        const { parseJSON, formatJSONToHTML } = module;

        try {
            const parsed = parseJSON(text);
            const html = formatJSONToHTML(parsed);
            showOverlay(html);
        } catch (e) {
            alert("Invalid JSON selection.");
        }
    } catch (e) {
        console.error("Failed to load formatter module", e);
    }
}

function showOverlay(htmlContent) {
    // Remove existing overlay
    const existing = document.getElementById('json-morph-host');
    if (existing) existing.remove();

    // Use a wrapper host in Light DOM
    const host = document.createElement('div');
    host.id = 'json-morph-host';

    // We'll use Shadow DOM to isolate styles
    const shadow = host.attachShadow({ mode: 'open' });

    // Inject Styles
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = chrome.runtime.getURL('assets/styles.css');
    shadow.appendChild(styleLink);

    // Backdrop (Inside Shadow DOM now)
    const backdrop = document.createElement('div');
    backdrop.className = 'json-morph-backdrop';

    // Structure
    const modal = document.createElement('div');
    modal.id = 'json-morph-modal';

    // Header
    const header = document.createElement('div');
    header.id = 'json-morph-header';

    const title = document.createElement('span');
    title.id = 'json-morph-title';
    title.innerText = 'JSON Morph';

    const closeBtn = document.createElement('button');
    closeBtn.id = 'json-morph-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => host.remove();

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Content
    const content = document.createElement('div');
    content.id = 'json-morph-content';

    const pre = document.createElement('pre');
    pre.className = 'json-container';
    pre.innerHTML = htmlContent;

    content.appendChild(pre);

    modal.appendChild(header);
    modal.appendChild(content);

    backdrop.appendChild(modal);
    shadow.appendChild(backdrop);

    document.body.appendChild(host);

    // Close on click outside (Backdrop logic)
    backdrop.addEventListener('click', (e) => {
        // e.target is the element clicked inside Shadow DOM.
        // If user clicks modal, e.target is modal (or child).
        // If user clicks backdrop, e.target is backdrop.
        if (e.target === backdrop) host.remove();
    });
}
