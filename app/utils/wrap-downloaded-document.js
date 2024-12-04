export function wrapDownloadedDocument(html) {
  const document = `
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
