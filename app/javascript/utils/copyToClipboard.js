/**
 * Copies the given text to the user's clipboard.
 * It first attempts to use the modern Clipboard API,
 * and falls back to a temporary textarea element for
 * older browsers or specific environments like iframes.
 *
 * @param {string} text - The string to be copied to the clipboard.
 * @returns {Promise<void>} A promise that resolves if the text was successfully copied.
 */
const copyToClipboard = (text) => {
    // Attempt to use the modern Clipboard API first.
    // This is the preferred method for security and user experience.
    if (navigator.clipboard && window.isSecureContext) {
        // The writeText() method returns a Promise, so we can use async/await
        // to handle the result.
        return navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Text successfully copied to clipboard using the modern API!');
            })
            .catch(err => {
                console.error('Could not copy text to clipboard using the modern API: ', err);
                // Fallback to the traditional method if the modern API fails.
                fallbackCopyToClipboard(text);
            });
    } else {
        // Fallback to the traditional method for non-secure contexts or older browsers.
        console.warn('Clipboard API not available. Falling back to the traditional method.');
        return new Promise((resolve) => {
            fallbackCopyToClipboard(text);
            resolve();
        });
    }
}

/**
 * The fallback function for copying text using a temporary textarea element.
 * This method is less ideal but has broader compatibility.
 *
 * @param {string} text - The string to be copied.
 */
function fallbackCopyToClipboard(text) {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;

    // Make the textarea invisible and non-interactive
    textarea.style.position = 'fixed';
    textarea.style.top = 0;
    textarea.style.left = 0;
    textarea.style.width = '2em';
    textarea.style.height = '2em';
    textarea.style.padding = 0;
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.boxShadow = 'none';
    textarea.style.background = 'transparent';
    textarea.readOnly = true;

    // Append the textarea to the document body
    document.body.appendChild(textarea);

    // Select the text within the textarea
    textarea.select();

    try {
        // Execute the copy command
        const successful = document.execCommand('copy');
        if (successful) {
            console.log('Text successfully copied to clipboard using fallback method!');
        } else {
            console.error('Fallback method failed to copy text.');
        }
    } catch (err) {
        console.error('Error in fallback clipboard copy: ', err);
    } finally {
        // Always remove the temporary textarea from the DOM
        document.body.removeChild(textarea);
    }
}

export default copyToClipboard