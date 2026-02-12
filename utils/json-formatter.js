/**
 * Smart JSON Parsing and Formatting Utility
 */

/**
 * Tries to parse a string into a JSON object.
 * Handles:
 * - Standard JSON
 * - Stringified JSON (recursively)
 * - Lax JSON (unquoted keys - simple regex attempt, or suggest using a library if complex)
 * 
 * @param {string} input 
 * @returns {any} Parsed JSON object or throws error
 */
export function parseJSON(input) {
    if (typeof input !== 'string') return input;

    let trimmed = input.trim();
    
    // 1. Try standard parse
    try {
        let result = JSON.parse(trimmed);
        
        // 2. Recursive parse if the result is a string that looks like JSON
        if (typeof result === 'string') {
            const innerTrimmed = result.trim();
            if ((innerTrimmed.startsWith('{') && innerTrimmed.endsWith('}')) || 
                (innerTrimmed.startsWith('[') && innerTrimmed.endsWith(']'))) {
                try {
                    return parseJSON(result);
                } catch (e) {
                    // If recursive parse fails, return the string itself (maybe it was just a string)
                    return result; 
                }
            }
        }
        return result;
    } catch (e) {
        // 3. Try fixing common issues (like unquoted keys)
        // This is a naive implementation. For robust results, a library like 'json5' is better,
        // but for a lightweight extension, we'll try basic fixes.
        
        // Replace unquoted keys: { key: "value" } -> { "key": "value" }
        // Regex looks for word characters at the start of line or after { or , followed by :
        try {
            const fixed = trimmed.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');
            return JSON.parse(fixed);
        } catch (e2) {
            throw e; // Throw original error if fix fails
        }
    }
}

/**
 * Formats JSON object into HTML string with syntax highlighting.
 * @param {any} json 
 * @returns {string} HTML string
 */
export function formatJSONToHTML(json) {
    if (json === null) return '<span class="json-null">null</span>';
    if (json === undefined) return '<span class="json-undefined">undefined</span>';
    
    if (typeof json === 'number') {
        return `<span class="json-number">${json}</span>`;
    }
    
    if (typeof json === 'boolean') {
        return `<span class="json-boolean">${json}</span>`;
    }
    
    if (typeof json === 'string') {
        // Escape HTML entities to prevent XSS when displaying
        const escaped = json.replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/"/g, '&quot;');
        return `<span class="json-string">"${escaped}"</span>`;
    }
    
    if (Array.isArray(json)) {
        if (json.length === 0) return '[]';
        
        let html = '[\n';
        json.forEach((item, index) => {
            html += '  ' + indentLines(formatJSONToHTML(item), '  ');
            if (index < json.length - 1) html += ',';
            html += '\n';
        });
        html += ']';
        return html;
    }
    
    if (typeof json === 'object') {
        const keys = Object.keys(json);
        if (keys.length === 0) return '{}';
        
        let html = '{\n';
        keys.forEach((key, index) => {
            html += `  <span class="json-key">"${key}"</span>: ${indentLines(formatJSONToHTML(json[key]), '  ')}`;
            if (index < keys.length - 1) html += ',';
            html += '\n';
        });
        html += '}';
        return html;
    }
    
    return String(json);
}

function indentLines(str, indent) {
    return str.split('\n').map((line, i) => i === 0 ? line : indent + line).join('\n');
}

export function isValidJSON(input) {
    try {
        parseJSON(input);
        return true;
    } catch (e) {
        return false;
    }
}
