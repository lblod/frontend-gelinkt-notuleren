import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { removeNodeFromTree } from '../utils/dom-helpers';
import { task } from 'ember-concurrency';
import { next } from '@ember/runloop';

export default Mixin.create({
  ajax: service(),
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
    let documentToSave = this.store.createRecord('editor-document', {previousVersion: editorDocument});
    let origHtml = this.editorDomNode.innerHTML;
    let innerHtml = this.cleanUpEditorDocumentInnerHtml(origHtml);
    let createdOn = editorDocument.get('createdOn') || new Date();
    let updatedOn = new Date();
    let title = editorDocument.get('title');

    let status = newStatus ? newStatus : editorDocument.get('status');
    documentToSave.setProperties({content: innerHtml, status, createdOn, updatedOn, title});
    await documentToSave.save();

    documentToSave.set('content', origHtml); //don't redraw stripped stuff
    return documentToSave;
  },

  async publishDocument(editorDocument, publishStatus){
    await this.saveEditorDocument(editorDocument, editorDocument.get('id') ? null : this.getStatusFor('conceptStatusId'));
    return await this.saveEditorDocument(editorDocument, publishStatus, true);
  },

  publishFlow: task(function *(){
    try {
      let editorDocument = this.editorDocument;
      let publishStatus = this.nextStatus;
      let newDocument = yield this.publishDocument(editorDocument, publishStatus);
      let apiEndPoint = this.getPublishApi(publishStatus);
      if(apiEndPoint){
        yield this.ajax.post(apiEndPoint(newDocument.get('id')));
      }
      this.transitionToRoute('/inbox');
    }
    catch(e){
      alert('Fout bij publiceren: ' + e);
      throw e;
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

  profile: 'default',

  init() {
    this._super(...arguments);
    this.set('profiles', ['default', 'all', 'none']);
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
