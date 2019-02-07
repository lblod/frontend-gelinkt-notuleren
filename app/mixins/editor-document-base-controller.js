import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { removeNodeFromTree } from '../utils/dom-helpers';
import { task } from 'ember-concurrency';

export default Mixin.create({
  ajax: service(),
  currentSession: service(),
  scrollToPlugin: service('rdfa-editor-scroll-to-plugin'),

  editorDocument: alias('model.editorDocument'),
  editorDocumentStatuses: alias('model.editorDocumentStatuses'),
  documentContainer: alias('model.documentContainer'),

  editorDomNode: null,

  validationErrors: false,

  statusIdMap: {
    trashStatusId: '5A8304E8C093B00009000010',
    conceptStatusId: 'c02542af-e6be-4cc6-be60-4530477109fc'
  },

  nextStatus: null,



  getStatusFor(statusName){
    return this.editorDocumentStatuses.findBy('id', this.statusIdMap[statusName]);
  },

  hasDocumentValidationErrors(document){
    if(!document.get('title')){
      return true;
    }
    return false;
  },

  // TODO: move to ember-rdfa-editor
  cleanUpEditorDocumentInnerHtml(innerHtml){
    // for now only remove highlights
    let template = document.createElement('template');
    template.innerHTML = innerHtml;
    let markTags = template.content.querySelectorAll('mark');
    markTags.forEach( tag => {
      removeNodeFromTree(tag);
    });

    return template.innerHTML;
  },

  async saveEditorDocument(editorDocument, newStatus){
    await this.saveTasklists();

    // create or extract properties
    let cleanedHtml = this.cleanUpEditorDocumentInnerHtml(this.editorDomNode.innerHTML);
    let createdOn = editorDocument.get('createdOn') || new Date();
    let updatedOn = new Date();
    let title = editorDocument.get('title');
    let documentContainer = this.documentContainer || await this.store.createRecord('document-container').save();
    let status = newStatus ? newStatus : await documentContainer.get('status');
    // every save results in new document
    let documentToSave = this.store.createRecord('editor-document', {content: cleanedHtml, createdOn, updatedOn, title, documentContainer});

    // Link the previous if provided editorDocument does exist in DB.
    if(editorDocument.id)
      documentToSave.set('previousVersion', editorDocument);

    // save the document
    await documentToSave.save();

    // set the latest revision
    documentContainer.set('currentVersion', documentToSave);
    documentContainer.set('status', status);
    await documentContainer.save();

    return documentToSave;
  },

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

  setEditorProfile: task(function *(){
    const bestuurseenheid = yield this.get('currentSession.group');
    this.set('profile', (yield bestuurseenheid.get('classificatie')).get('uri'));
  }),

  profile: 'default',
  init() {
    this._super(...arguments);
    this.setEditorProfile.perform();
  },

 actions: {

   debug(info) {
      this.set('debug', info);
   },

   sendToTrash(){
     this.set('displayDeleteModal', true);
   },

   async publish(){
     const editorDocument = this.editorDocument;
     const savedDocument = await this.saveEditorDocument(editorDocument, editorDocument.get('id') ? null : this.getStatusFor('conceptStatusId'));
     const container = await savedDocument.get('documentContainer');
     const containerId = container.id;
     this.transitionToRoute('documents.show.publish.index', containerId);
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
