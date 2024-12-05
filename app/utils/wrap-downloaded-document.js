export function wrapDownloadedDocument(html) {
  const document = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
        </head>
        <body>
          ${html}
        </body>
      </html>
  `;
  return document;
}
