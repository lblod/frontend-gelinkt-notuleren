import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { removeNodeFromTree } from '../utils/dom-helpers';

export default Mixin.create({
  ajax: service(),

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
    if(currStatus.get('id') === this.get('statusIdMap')['agendaPublishedStatusId'])
      return this.getStatusFor('besluitenlijstPublishedStatusId');

    if(currStatus.get('id') === this.get('statusIdMap')['besluitenlijstPublishedStatusId'])
      return this.getStatusFor('signedPublishedStatusId');

    return this.getStatusFor('agendaPublishedStatusId');
  },

  getPublishApi(currStatus){
    if(currStatus.get('id') === this.get('statusIdMap')['agendaPublishedStatusId'])
      return editorDocumentId => `/publish/agenda/${editorDocumentId}`;

    if(currStatus.get('id') === this.get('statusIdMap')['besluitenlijstPublishedStatusId'])
      return editorDocumentId => `/publish/decision/${editorDocumentId}`;

    if(currStatus.get('id') === this.get('statusIdMap')['signedPublishedStatusId'])
      return editorDocumentId => `/publish/notule/${editorDocumentId}`;
  },

  isProcessing: false,
  displayPublishStatusModal: false,

  modalTransitionToTrash: computed('displayPublishStatusModal', function(){
    return this.get('nextStatus.id') ===  this.get('statusIdMap')['trashStatusId'] && this.get('displayPublishStatusModal');
  }),
  modalTransitionToAgendaPublished: computed('displayPublishStatusModal', function(){
    return this.get('nextStatus.id') ===  this.get('statusIdMap')['agendaPublishedStatusId'] && this.get('displayPublishStatusModal');
  }),
  modalTransitionToBesluitenlijstPublished: computed('displayPublishStatusModal', function(){
    return this.get('nextStatus.id') ===  this.get('statusIdMap')['besluitenlijstPublishedStatusId'] && this.get('displayPublishStatusModal');
  }),
  modalTransitionToSignedPublished: computed('displayPublishStatusModal', function(){
    return this.get('nextStatus.id') ===  this.get('statusIdMap')['signedPublishedStatusId'] && this.get('displayPublishStatusModal');
  }),

  getStatusFor(statusName){
    return this.get('editorDocumentStatuses').findBy('id', this.get('statusIdMap')[statusName]);
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

  async saveEditorDocument(editorDocument, newStatus, toNewDocument){
    let documentToSave = toNewDocument ? this.get('store').createRecord('editor-document', {previousVersion: editorDocument}) : editorDocument;
    let origHtml = this.get('editorDomNode').innerHTML;
    let innerHtml = this.cleanUpEditorDocumentInnerHtml(origHtml);
    let createdOn = editorDocument.get('createdOn') || new Date().toISOString();
    let title = editorDocument.get('title');
    let status = newStatus ? newStatus : editorDocument.get('status');
    documentToSave.setProperties({content: innerHtml, status, createdOn, title});
    await documentToSave.save();

    documentToSave.set('content', origHtml); //don't redraw stripped stuff
    return documentToSave;
  },

  async publishDocument(editorDocument, publishStatus){
    await this.saveEditorDocument(editorDocument, editorDocument.get('id') ? null : this.getStatusFor('conceptStatusId'));
    return await this.saveEditorDocument(editorDocument, publishStatus, true);
  },

  async publishFlow(){
    this.set('isProcessing', true);
    try {
      let editorDocument = this.get('editorDocument');
      let publishStatus = this.get('nextStatus');
      let newDocument = await this.publishDocument(editorDocument, publishStatus);
      let apiEndPoint = this.getPublishApi(publishStatus);
      if(apiEndPoint){
        await this.get('ajax').post(apiEndPoint(newDocument.get('id')));
      }
      this.set('isProcessing', false);
      this.transitionToRoute('/inbox');
    }
    catch(e){
      this.set('isProcessing', false);
      alert('Fout bij publiceren: ' + e);
      throw e;
    }
  },

  profile: 'default',

  init() {
    this._super(...arguments);
    this.set('profiles', ['default', 'all', 'none']);
  },

 actions: {
   handleRdfaEditorInit(editor){
     if(editor){
       this.set('editorDomNode', editor.get('rootNode'));
       return;
     }
     this.set('editorDomNode', null);
   },

   debug(info) {
      this.set('debug', info);
   },

   async save(){
     let editorDocument = this.get('editorDocument');

     if(this.hasDocumentValidationErrors(editorDocument)){
       this.set('validationErrors', true);
       return;
     }

     await this.saveEditorDocument(editorDocument);
   },

   sendToTrash(){
     this.set('nextStatus', this.getStatusFor('trashStatusId'));
     this.set('displayPublishStatusModal', true);
   },

   publish(){
     if(this.hasDocumentValidationErrors(this.get('editorDocument'))){
       this.set('validationErrors', true);
       return;
     }
     this.set('nextStatus', this.getNextPublishStatus(this.get('editorDocument.status')));
     this.set('displayPublishStatusModal', true);
   },

   async terminatePublishFlow(){
     this.resetPublishStatusModal();
     this.publishFlow();
   },

   onClosePublishStatusModal(){
     this.resetPublishStatusModal();
   },

   closeValidationModal(){
     this.set('validationErrors', false);
   }

 }
});
