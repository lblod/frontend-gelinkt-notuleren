import generateExportFromHtmlBody from './generate-export-from-html-body';

export default function generateExportFromEditorDocument(editorDocument) {
  const context = JSON.parse(editorDocument.context);
  let prefixes = Object.entries(context.prefix)
    .map(([key, value]) => {
      return `${key}: ${value}`;
    })
    .join(' ');
  const body = `
      <div vocab="${context.vocab}" prefix="${prefixes}" typeof="foaf:Document" resource="#">
        ${editorDocument.content}
      </div>
  `;
  generateExportFromHtmlBody(editorDocument.title, body);
}
