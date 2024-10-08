import generateExportFromHtmlBody from './generate-export-from-html-body';
import { stripHtmlForPublish } from '@lblod/ember-rdfa-editor/utils/strip-html-for-publish';

export function generateExportTextFromEditorDocument(
  editorDocument,
  forPublication,
) {
  const context = JSON.parse(editorDocument.context);
  let prefixes = Object.entries(context.prefix)
    .map(([key, value]) => {
      return `${key}: ${value}`;
    })
    .join(' ');
  let content = editorDocument.content;
  if (forPublication) {
    content = stripHtmlForPublish(content);
  }
  const body = `
      <div vocab="${context.vocab}" prefix="${prefixes}" typeof="foaf:Document" resource="#">
        ${content}
      </div>
  `;
  return body;
}

export default function generateExportFromEditorDocument(
  editorDocument,
  forPublication,
) {
  const body = generateExportTextFromEditorDocument(
    editorDocument,
    forPublication,
  );
  generateExportFromHtmlBody(editorDocument.title, body);
}
