# json-morph-extension
This extension allows you to format and view JSON from any webpage or via a popup.

## installation
Open Chrome and navigate to chrome://extensions.
Enable Developer mode (toggle in the top right).
Click Load unpacked.
Select the json-morph-extension folder in your workspace: .\json-morph-extension

## Features & Usage
1. Popup Mode

- Click the **JSON Morph** icon in the toolbar.
- Paste any JSON string (even dirty or escaped JSON).
- Click Format.
- Use Open in Tab to view large JSON in a new tab.

2. Context Menu (Right-Click)

- Select any JSON text on a webpage.
- Right-click and choose **JSON Morph**.
- Options:
  - **Show Embedded (Overlay):** Opens a modal on the current page.
  - **Show in New Tab:** Opens a dedicated viewer tab.

3. Keyboard Shortcut

- Select JSON text.
- Press `Ctrl+Shift+F` (or `Command+Shift+F` on Mac).
- This triggers the **Embedded Overlay** by default.

4. Smart Parsing (Escaped JSON)

- The extension automatically handles:
  - Escaped JSON strings (e.g., `{\"a\":1}`).
  - Double-escaped strings (common in logs).
  - Unquoted keys (lax JSON).