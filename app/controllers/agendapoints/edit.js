import Controller from '@ember/controller';
import { task } from "ember-concurrency";
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { TRASH_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import generateExportFromEditorDocument from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';

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
    generateExportFromEditorDocument(this.editorDocument);
  }

  @task
  *copyAgendapunt() {
    const response = yield fetch(`/agendapoint-service/${this.documentContainer.id}/copy`, {method: 'POST'});
    const json = yield response.json();
    const agendapuntId = json.uuid;
    yield this.transitionToRoute('agendapoints.edit', agendapuntId);
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
  }

  @tracked uploading=false;
  @action toggleUpload(){
    this.uploading=!this.uploading;
  }
}
