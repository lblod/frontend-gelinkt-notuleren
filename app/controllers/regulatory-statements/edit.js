import Controller from '@ember/controller';
import { action } from '@ember/object';
import { PLUGIN_CONFIGS } from 'frontend-gelinkt-notuleren/config/constants';

export default class RegulatoryStatementsRoute extends Controller {
  plugins = [
    'article-structure',
    { name: 'rdfa-toc', options: { config: PLUGIN_CONFIGS.TABLE_OF_CONTENTS } },
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
  handleRdfaEditorInit(controller) {
    controller.setHtmlContent(this.editorDocument.content);
  }
}
