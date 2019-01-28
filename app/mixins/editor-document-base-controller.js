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

  editorDomNode: null,

  validationErrors: false,

  statusIdMap: {
    trashStatusId: '5A8304E8C093B00009000010',
    conceptStatusId: 'cfd751588a6c453296de9f9c0dff2af4',
    agendaPublishedStatusId: '627aec5d144c422bbd1077022c9b45d1',
    besluitenlijstPublishedStatusId: 'b763390a63d548bb977fb4804293084a',
    signedPublishedStatusId: 'c272d47d756d4aeaa0be72081f1389c6'
  },

  nextStatus: null,

  getNextPublishStatus(currStatus){
    if(currStatus.get('id') === this.statusIdMap['agendaPublishedStatusId'])
      return this.getStatusFor('besluitenlijstPublishedStatusId');

    if(currStatus.get('id') === this.statusIdMap['besluitenlijstPublishedStatusId'])
      return this.getStatusFor('signedPublishedStatusId');

    return this.getStatusFor('agendaPublishedStatusId');
  },

  getPublishApi(currStatus){
    if(currStatus.get('id') === this.statusIdMap['agendaPublishedStatusId'])
      return editorDocumentId => `/publish/agenda/${editorDocumentId}`;

    if(currStatus.get('id') === this.statusIdMap['besluitenlijstPublishedStatusId'])
      return editorDocumentId => `/publish/decision/${editorDocumentId}`;

    if(currStatus.get('id') === this.statusIdMap['signedPublishedStatusId'])
      return editorDocumentId => `/publish/notule/${editorDocumentId}`;
  },

  displayPublishStatusModal: false,

  modalTransitionToTrash: computed('displayPublishStatusModal', function(){
    return this.get('nextStatus.id') ===  this.statusIdMap['trashStatusId'] && this.displayPublishStatusModal;
  }),
  modalTransitionToAgendaPublished: computed('displayPublishStatusModal', function(){
    return this.get('nextStatus.id') ===  this.statusIdMap['agendaPublishedStatusId'] && this.displayPublishStatusModal;
  }),
  modalTransitionToBesluitenlijstPublished: computed('displayPublishStatusModal', function(){
    return this.get('nextStatus.id') ===  this.statusIdMap['besluitenlijstPublishedStatusId'] && this.displayPublishStatusModal;
  }),
  modalTransitionToSignedPublished: computed('displayPublishStatusModal', function(){
    return this.get('nextStatus.id') ===  this.statusIdMap['signedPublishedStatusId'] && this.displayPublishStatusModal;
  }),

  getStatusFor(statusName){
    return this.editorDocumentStatuses.findBy('id', this.statusIdMap[statusName]);
  },

  resetPublishStatusModal(){
    this.set('displayPublishStatusModal', false);
    this.set('publishModalStatus', '');
  },

  hasDocumentValidationErrors(document){
    if(!document.get('title')){
      return true;
    }
    return false;
  },

  cleanUpEditorDocumentInnerHtml(innerHtml){
    //for now only remove highlights
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

    //create or extract properties
    let cleanedHtml = this.cleanUpEditorDocumentInnerHtml(this.editorDomNode.innerHTML);
    let createdOn = editorDocument.get('createdOn') || new Date();
    let updatedOn = new Date();
    let title = editorDocument.get('title');
    let status = newStatus ? newStatus : editorDocument.get('status');
    let bestuurseenheid = this.bestuurseenheid;

    //every save results in new document
    let documentToSave = this.store.createRecord('editor-document', {content: cleanedHtml, status, createdOn, updatedOn, title, bestuurseenheid});

    //Link the previous if provided editorDocument does exist in DB.
    if(editorDocument.id)
      documentToSave.set('previousVersion', editorDocument);

    //save the document
    await documentToSave.save();

    return documentToSave;
  },

  async publishDocument(editorDocument, publishStatus){
    let savedDocument = await this.saveEditorDocument(editorDocument, editorDocument.get('id') ? null : this.getStatusFor('conceptStatusId'));
    return await this.saveEditorDocument(savedDocument, publishStatus);
  },

  publishFlow: task(function *(){
    let newDocument = null;
    try {

      let editorDocument = this.editorDocument;
      let publishStatus = this.nextStatus;
      newDocument = yield this.publishDocument(editorDocument, publishStatus);
      let apiEndPoint = this.getPublishApi(publishStatus);
      if(apiEndPoint){
        yield this.ajax.post(apiEndPoint(newDocument.get('id')));
      }
      this.transitionToRoute('/inbox');
    }
    catch(e){
      alert('Fout bij publiceren: ' + e);

      //rollback
      if(newDocument){
        newDocument.set('status', this.get('previousStatus'));
        yield newDocument.save();
        this.transitionToRoute('editor-documents.edit', newDocument.id, {queryParams: { scrollToLastSavePosition: true } });
      }
      else {
        this.editorDocument.set('status', this.get('previousStatus'));
        yield this.editorDocument.save();
      }
    }
  }),

  async saveTasklists(){
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

  setEditorBestuurseenheid: task(function *(){
    const bestuurseenheid = yield this.get('currentSession.group');
    this.set('bestuurseenheid', bestuurseenheid);
  }),

  profile: 'default',

  init() {
    this._super(...arguments);
    this.setEditorProfile.perform();
    this.setEditorBestuurseenheid.perform();
  },

 actions: {

   debug(info) {
      this.set('debug', info);
   },

   sendToTrash(){
     this.set('nextStatus', this.getStatusFor('trashStatusId'));
     this.set('displayPublishStatusModal', true);
   },

   publish(){
     this.set('previousStatus', this.get('editorDocument.status'));
     if(this.hasDocumentValidationErrors(this.editorDocument)){
       this.set('validationErrors', true);
       return;
     }
     this.set('nextStatus', this.getNextPublishStatus(this.get('editorDocument.status')));
     this.set('displayPublishStatusModal', true);
   },

   terminatePublishFlow(){
     this.resetPublishStatusModal();
     this.publishFlow.perform();
   },

   onClosePublishStatusModal(){
     this.resetPublishStatusModal();
   },

   closeValidationModal(){
     this.set('validationErrors', false);
   },

   updateTasklists(tasklists){
     this.set('tasklists', tasklists);
   }

 }
});
