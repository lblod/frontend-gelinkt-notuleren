/**
 * @typedef {Object} CopyArgs
 * @property {string?} html
 * @property {string?} plainText
 * @property {boolean?} renderHtmlToPlain
 */

/**
 * @param {CopyArgs}
 * @returns {Promise<void>}
 */
export async function copyStringToClipboard({
  html,
  plainText,
  renderHtmlToPlain = true,
} = {}) {
  if (!html && !plainText) {
    return;
  }
  let plainBlob = null;
  let htmlBlob = null;
  if (plainText) {
    // using proper Blobs, cause chrome requires them
    plainBlob = new Blob([plainText], { type: 'text/plain' });
  }

  if (html) {
    htmlBlob = new Blob([html], { type: 'text/html' });
    if (!plainBlob && renderHtmlToPlain) {
      // we briefly render the html so that the browser can give us
      // a plaintext version with proper newlines
      // innerText is the human-readable text version of an html element,
      // but it only works if the element is actually visibly rendered
      // when you request it, otherwise it just concatenates all textnodes
      // without regard for visible newlines
      //
      // stupid, but it works
      const parser = new DOMParser();
      const element = parser.parseFromString(html, 'text/html').body;
      document.firstElementChild.append(element);
      plainBlob = new Blob([element.innerText], { type: 'text/plain' });
      element.remove();
    }
  }
  const clipboardElements = {};
  if (htmlBlob) {
    clipboardElements['text/html'] = htmlBlob;
  }
  if (plainBlob) {
    clipboardElements['text/plain'] = plainBlob;
  }
  await navigator.clipboard.write([new ClipboardItem(clipboardElements)]);
}
