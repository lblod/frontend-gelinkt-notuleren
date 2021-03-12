export default function generateExportFromEditorDocument(editorDocument) {
  const context = JSON.parse(editorDocument.context);
  let prefixes = Object.entries(context.prefix).map(([key, value]) => {
    return `${key}: ${value}`;
  }).join(' ');
  const body = `
      <div vocab="${context.vocab}" prefix="${prefixes}" typeof="foaf:Document" resource="#">
        ${editorDocument.content}
      </div>
  `;
  const title = editorDocument.title;
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(body));
  element.setAttribute('download', `${title}.html`);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
