import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Mixin.create({
  currentSession: service(),

  editorDocument: alias('model.editorDocument'),
  editorDocumentStatuses: alias('model.editorDocumentStatuses'),
  editorDocumentFolders: alias('model.editorDocumentFolders'),
  documentContainer: alias('model.documentContainer'),

  validationErrors: false,

  statusIdMap: {
    trashStatusId: '5A8304E8C093B00009000010',
    conceptStatusId: 'c02542af-e6be-4cc6-be60-4530477109fc',
    actiefStatusId: 'c02542af-e6be-4cc6-be60-4530477109fc',
    gearchiveerdStatusId: 'cda8ec80-8508-40e2-9bbb-bee6d9536abb'
  },

  folderIdMap: {
    meetingMinutesId: '0239c9f9-d7eb-48d2-8195-00d2c281206b',
    draftDecisionsId: 'ae5feaed-7b70-4533-9417-10fbbc480a4c'
  },

  nextStatus: null,
  saveIsRunning: computed('saveEditorDocument.isRunning', 'publish.isRunning', function() {
    return this.saveEditorDocument.isRunning || this.publish.isRunning;
  }),

  getStatusFor(statusName) {
    return this.editorDocumentStatuses.findBy('id', this.statusIdMap[statusName]);
  },

  getFolderFor(folderName) {
    return this.editorDocumentFolders.findBy('id', this.folderIdMap[folderName]);
  },

  hasDocumentValidationErrors(document){
    if(!document.get('title')){
      return true;
    }
    return false;
  },

  saveEditorDocument: task(function *(editorDocument, newStatus, newFolder) {
    yield this.saveTasklists();

    // create or extract properties
    let cleanedHtml = this.editor.htmlContent;
    let createdOn = editorDocument.get('createdOn') || new Date();
    let updatedOn = new Date();
    let title = editorDocument.get('title');
    let documentContainer = this.documentContainer || (yield this.store.createRecord('document-container').save());
    let status = newStatus ? newStatus : (yield documentContainer.get('status'));
    let folder = newFolder ? newFolder : (yield documentContainer.get('folder'));

    // every save results in new document
    let documentToSave = this.store.createRecord('editor-document', {content: cleanedHtml, createdOn, updatedOn, title, documentContainer});

    // Link the previous if provided editorDocument does exist in DB.
    if(editorDocument.id)
      documentToSave.set('previousVersion', editorDocument);

    // save the document
    yield documentToSave.save();

    // set the latest revision
    documentContainer.set('currentVersion', documentToSave);
    documentContainer.set('status', status);
    documentContainer.set('folder', folder);
    const bestuurseenheid = yield this.currentSession.get('group');
    documentContainer.set('publisher', bestuurseenheid);
    yield documentContainer.save();

    return documentToSave;
  }),

  async saveTasklists(){
    if (!this.tasklists)
      return;
    for(let tasklistSolution of this.tasklists){
      let taskSolutions = await tasklistSolution.taskSolutions.toArray();
      for(let taskSolution of taskSolutions){
        await taskSolution.save();
      }
      await tasklistSolution.save();
    }
  },

  publish: task(function *(){
    const editorDocument = this.editorDocument;
    const status = this.getStatusFor('conceptStatusId');
    const folder = this.getFolderFor('meetingMinutesId');
    const savedDocument = yield this.saveEditorDocument.perform(editorDocument, status, folder);
    this.set('editorDocument', savedDocument);
    const container = yield savedDocument.get('documentContainer');
    const containerId = container.id;
    this.transitionToRoute('documents.show.publish.index', containerId);
  }),

  profile: 'default',

  actions: {
    debug(info) {
       this.set('debug', info);
    },

    sendToTrash(){
      this.set('displayDeleteModal', true);
    },

    publish() {
      this.publish.perform();
    },

    async deleteDocument(){
      const container = this.documentContainer;
      const deletedStatus = this.getStatusFor('trashStatusId');
      container.set('status', deletedStatus);
      await container.save();
      this.set('displayDeleteModal', false);
      this.transitionToRoute('inbox');
    },

    onCloseDeleteModal(){
      this.set('displayDeleteModal', false);
    },

    closeValidationModal(){
      this.set('validationErrors', false);
    },

    updateTasklists(tasklists){
      this.set('tasklists', tasklists);
    }

  }
});
