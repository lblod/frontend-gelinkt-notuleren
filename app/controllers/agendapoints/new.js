import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from "ember-concurrency";
import { DRAFT_FOLDER_ID, DRAFT_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';

export default class AgendapointsNewController extends Controller {
  @service currentSession;
  @tracked editor;
  @tracked hasDocumentValidationErrors = false;
  profile = 'draftDecisionsProfile';

  get editorDocument() {
    return this.model;
  }

  @action
  handleRdfaEditorInit(editor) {
    this.editor = editor;
    editor.setHtmlContent('Voeg sjabloon in voor besluit of vrij tekstveld (bijvoorbeeld voor een vraag, antwoord of tussenkomst)');
  }

  @action
  closeValidationModal(){
    this.hasDocumentValidationErrors = false;
  }

  @task
  *saveTask() {
    if (! this.editorDocument.title) {
      this.hasDocumentValidationErrors = true;
    }
    else {
      this.hasDocumentValidationErrors = false;
      const html = this.editor.htmlContent;
      this.editorDocument.content = html;
      this.editorDocument.createdOn = new Date();
      this.editorDocument.updatedOn = new Date();
      yield this.editorDocument.save();

      const documentContainer = this.store.createRecord('document-container');
      documentContainer.currentVersion = this.editorDocument;
      documentContainer.status = yield this.store.findRecord('concept', DRAFT_STATUS_ID);
      documentContainer.folder = yield this.store.findRecord('editor-document-folder', DRAFT_FOLDER_ID);
      documentContainer.publisher = this.currentSession.group;
      yield documentContainer.save();

      yield this.transitionToRoute('agendapoints.edit', documentContainer.id);
    }
  }

  @action
  async save() {
    await this.saveTask.perform();
  }
}
