import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';

const DRAFT_DECISION_FOLDER_ID = 'ae5feaed-7b70-4533-9417-10fbbc480a4c';
const GEAGENDEERD_STATUS_ID = '7186547b61414095aa2a4affefdcca67';

export default class MeetingsEditTreatmentController extends Controller {
  @service router;
  @service currentSession;
  @tracked editor;
  @tracked documentContainer;
  @tracked document;
  @tracked initialContent;
  @tracked uploading = false;
  @tracked decisions = [];
  @service documentService;

  setup() {
    this.editor = null;
    this.fetchOrCreateDocumentTask.perform();
  }

  get dirty() {
    return this.document.content !== this.editor.htmlContent;
  }

  @action
  closeModal() {
    this.uploading=false;
    this.router.transitionTo('meetings.edit');
  }

  @action
  handleRdfaEditorInit(editor) {
    if (this.document.content) {
      editor.setHtmlContent(this.document.content);
    }
    this.editor = editor;
  }

  @action
  async saveAndQuit() {
    await this.saveDocumentTask.perform();
    this.closeModal();
  }

  @task
  *saveDocumentTask() {
    // create or extract properties
    let cleanedHtml = this.editor.htmlContent;
    let createdOn = this.document.get('createdOn') || new Date();
    let updatedOn = new Date();
    let title = this.document.get('title');
    let documentContainer = this.documentContainer;
    let status = yield documentContainer.get('status');
    let folder = yield documentContainer.get('folder');

    if (status && status.isLoaded && folder && folder.isLoaded) {
      // every save results in new document
      let documentToSave = this.store.createRecord('editor-document', {
        content: cleanedHtml,
        createdOn,
        updatedOn,
        title,
        documentContainer,
      });

      // Link the previous if provided editorDocument does exist in DB.
      if (!this.document.get('isNew')) {
        documentToSave.set('previousVersion', this.document);
      }

      try {
        // save the document
        yield documentToSave.save();
        this.document = documentToSave;
      } catch (e) {
        console.error('Error saving the document');
        console.error(e);
      }

      // set the latest revision
      documentContainer.set('currentVersion', documentToSave);
      documentContainer.set('status', status);
      documentContainer.set('folder', folder);
      const bestuurseenheid = this.currentSession.group;
      documentContainer.set('publisher', bestuurseenheid);

      try {
        yield documentContainer.save();
      } catch (e) {
        console.error('Error saving the document container');
        console.error(e);
      }
    } else {
      console.error(`The status or the folder didn't correctly load`);
    }
  }

  @task
  *fetchOrCreateDocumentTask() {
    const { treatment } = this.model;
    let container = yield treatment.documentContainer;
    const draftDecisionFolder = yield this.store.findRecord(
      'editor-document-folder',
      DRAFT_DECISION_FOLDER_ID
    );
    const geagendeerdStatus = yield this.store.findRecord(
      'concept',
      GEAGENDEERD_STATUS_ID
    ); //geagendeerd status

    if (!container) {
      container = this.store.createRecord('document-container', {
        folder: draftDecisionFolder,
        status: geagendeerdStatus,
      });
      yield container.save();
      treatment.documentContainer = container;
      yield treatment.save();
    }
    let document = yield container.currentVersion;
    if (!document) {
      const title = yield treatment.get('onderwerp.titel');
      document = this.store.createRecord('editor-document', {
        title,
        createdOn: new Date(),
        updatedOn: new Date(),
      });
      yield document.save();
      container.currentVersion = document;
    }
    this.documentContainer = container;
    this.document = document;
  }

  @action toggleUpload(){
    this.uploading=!this.uploading;
    this.fetchDecisions.perform();
  }
  
  @task 
  *toggleUploadAndSave(){
    yield this.saveDocumentTask.perform();
    this.uploading=!this.uploading;
    this.fetchDecisions.perform();
  }

  @task
  *fetchDecisions() {
    const documentContainer = yield this.documentContainer;
    const currentVersion = yield documentContainer.currentVersion;
    this.decisions = this.documentService.getDecisions(currentVersion);
  }
}
