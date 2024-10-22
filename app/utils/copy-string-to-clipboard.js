import { gecko } from '@lblod/ember-rdfa-editor/utils/_private/browser';

/**
 * @typedef {Object} CopyArgs
 * @property {string?} html
 * @property {string?} plainText
 * @property {boolean?} renderHtmlToPlain - Also render the html content to plain text using
 * `innerText`. Note, this is always treated as true on Firefox we need to work around the clipboard
 * API stripping RDFa attributes, so we use an older API which performs this automatically
 */

/**
 * @param {CopyArgs}
 * @returns {Promise<void>}
 */
export async function copyStringToClipboard(args = {}) {
  if (gecko && args.html) {
    return copyStringUsingDeprecatedApi(args.html);
  } else {
    return copyStringUsingClipboardApi(args);
  }
}

/**
 * @param {CopyArgs}
 * @returns {Promise<void>}
 */
export async function copyStringUsingClipboardApi({
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

/**
 * @param {string} html
 * @returns {void}
 */
export function copyStringUsingDeprecatedApi(html) {
  if (!html) {
    return;
  }
  const parser = new DOMParser();
  const inEl = parser.parseFromString(html, 'text/html').body;
  const element = document.createElement('div');
  element.appendChild(inEl);
  document.body.lastElementChild.append(element);
  document.getSelection().selectAllChildren(element);
  document.execCommand('copy');
  element.remove();
}
