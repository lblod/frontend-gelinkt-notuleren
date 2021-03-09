import Controller from '@ember/controller';
import { task } from "ember-concurrency-decorators";
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { TRASH_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';

function generateDocumentToDownload(editorDocument) {
  const context = JSON.parse(editorDocument.context);
  let prefixes = Object.entries(context.prefix).map(([key, value]) => {
    return `${key}: ${value}`;
  }).join(' ');
  const document = `
      <div vocab="${context.vocab}" prefix="${prefixes}" typeof="foaf:Document" resource="#">
        ${editorDocument.content}
      </div>
    `;
  return document;
}

export default class AgendapointsEditController extends Controller {
  @service currentSession;
  @tracked editor;
  @tracked hasDocumentValidationErrors = false;
  @tracked displayDeleteModal = false;
  @tracked _editorDocument;
  profile = 'draftDecisionsProfile';

  get editorDocument() {
    return this._editorDocument || this.model.editorDocument;
  }

  get documentContainer() {
    return this.model.documentContainer;
  }

  @action
  handleRdfaEditorInit(editor) {
    this.editor = editor;
    editor.setHtmlContent(this.editorDocument.content);
  }

  @action
  download() {
    this.editorDocument.content = this.editor.htmlContent;
    const doc = generateDocumentToDownload(this.editorDocument);
    const title = this.editorDocument.title;
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(doc));
    element.setAttribute('download', `${title}.html`);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  @action
  toggleDeleteModal(){
    this.displayDeleteModal = ! this.displayDeleteModal;
  }

  @action
  closeValidationModal(){
    this.hasDocumentValidationErrors = false;
  }

  @action
  async deleteDocument(){
    const container = this.documentContainer;
    const deletedStatus = await this.store.findRecord('concept', TRASH_STATUS_ID);
    container.status = deletedStatus;
    await container.save();
    this.displayDeleteModal = false;
    this.transitionToRoute('inbox.agendapoints');
  }

  @task
  *saveTask() {
    if (! this.editorDocument.title) {
      this.hasDocumentValidationErrors = true;
    }
    else {
      this.hasDocumentValidationErrors = false;
    }

    const html = this.editor.htmlContent;
    const editorDocument = this.store.createRecord('editor-document');
    editorDocument.content = html;
    editorDocument.createdOn = new Date();
    editorDocument.updatedOn = new Date();
    editorDocument.title = this.editorDocument.title;
    editorDocument.previousVersion = this.editorDocument;
    yield editorDocument.save();
    this._editorDocument = editorDocument;

    const documentContainer = this.documentContainer;
    documentContainer.currentVersion = editorDocument;
    yield documentContainer.save();
  }

  @action
  async save() {
    await this.saveTask.perform();
  }
}
