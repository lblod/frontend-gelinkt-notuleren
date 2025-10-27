import type EditorDocument from 'frontend-gelinkt-notuleren/models/editor-document';
import generateExportFromHtmlBody from './generate-export-from-html-body';
import { stripHtmlForPublish } from '@lblod/ember-rdfa-editor/utils/strip-html-for-publish';
import type { Context } from 'frontend-gelinkt-notuleren/config/editor-document-default-context';

export function generateExportTextFromEditorDocument(
  editorDocument: EditorDocument,
  forPublication?: boolean,
) {
  const context = JSON.parse(editorDocument.context ?? '') as Context;
  const prefixes = Object.entries(context.prefix)
    .map(([key, value]) => {
      return `${key}: ${value}`;
    })
    .join(' ');
  let content = editorDocument.content;
  if (forPublication) {
    content = stripHtmlForPublish(content ?? '');
  }
  const body = `
      <div vocab="${context.vocab}" prefix="${prefixes}" typeof="foaf:Document" resource="#">
        ${content}
      </div>
  `;
  return body;
}

export default function generateExportFromEditorDocument(
  editorDocument: EditorDocument,
  forPublication?: boolean,
) {
  const body = generateExportTextFromEditorDocument(
    editorDocument,
    forPublication,
  );
  generateExportFromHtmlBody(editorDocument.title, body);
}
