import Controller from '@ember/controller';
import { action } from '@ember/object';
import { PLUGIN_CONFIGS } from 'frontend-gelinkt-notuleren/config/constants';
import { task } from 'ember-concurrency';
import generateExportFromEditorDocument from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class RegulatoryStatementsRoute extends Controller {
  @service documentService;
  @tracked editor;
  plugins = [
    'article-structure',
    { name: 'rdfa-toc', options: { config: PLUGIN_CONFIGS.TABLE_OF_CONTENTS } },
    'template-variable',
    'rdfa-date',
    'import-snippet',
    'citaten-plugin',
  ];

  get dirty() {
    return this.editorDocument.content !== this.editor.htmlContent;
  }

  get editorDocument() {
    return this._editorDocument || this.model.editorDocument;
  }

  get documentContainer() {
    return this.model.documentContainer;
  }

  @action
  download() {
    this.editorDocument.content = this.editor.htmlContent;
    generateExportFromEditorDocument(this.editorDocument);
  }

  @task
  *saveTask() {
    if (!this.editorDocument.title) {
      this.hasDocumentValidationErrors = true;
    } else {
      this.hasDocumentValidationErrors = false;
      const html = this.editor.htmlContent;
      const editorDocument =
        yield this.documentService.createEditorDocument.perform(
          this.editorDocument.title,
          html,
          this.documentContainer,
          this.editorDocument
        );
      this._editorDocument = editorDocument;

      const documentContainer = this.documentContainer;
      documentContainer.currentVersion = editorDocument;
      yield documentContainer.save();
    }
  }

  @task
  *onTitleUpdate(title) {
    const html = this.editorDocument.content;
    const editorDocument =
      yield this.documentService.createEditorDocument.perform(
        title,
        html,
        this.documentContainer,
        this.editorDocument
      );
    this._editorDocument = editorDocument;
  }

  @action
  handleRdfaEditorInit(controller) {
    controller.setHtmlContent(this.editorDocument.content);
    this.editor = controller;
  }
}
