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

  statusPublishApiEndPoint: {
    agendaPublishedStatusId: editorDocumentId => `/publish/agenda/${editorDocumentId}`,
    besluitenlijstPublishedStatusId: editorDocumentId => `/publish/decision/${editorDocumentId}`,
    signedPublishedStatusId: editorDocumentId => `/publish/notule/${editorDocumentId}`
  },

  isProcessing: false,
  displayPublishStatusModal: false,
  publishModalStatus: '',
  modalTransitionToTrash: computed('displayPublishStatusModal', function(){
    return this.get('publishModalStatus') === 'trashStatusId' && this.get('displayPublishStatusModal');
  }),
  modalTransitionToAgendaPublished: computed('displayPublishStatusModal', function(){
    return this.get('publishModalStatus') === 'agendaPublishedStatusId' && this.get('displayPublishStatusModal');
  }),
  modalTransitionToBesluitenlijstPublished: computed('displayPublishStatusModal', function(){
    return this.get('publishModalStatus') === 'besluitenlijstPublishedStatusId' && this.get('displayPublishStatusModal');
  }),
  modalTransitionToSignedPublished: computed('displayPublishStatusModal', function(){
    return this.get('publishModalStatus') === 'signedPublishedStatusId' && this.get('displayPublishStatusModal');
  }),

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

  async saveEditorDocument(editorDocument){
    let innerHtml = this.get('editorDomNode').innerHTML;
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
    await this.saveEditorDocument(editorDocument);
    let newDocument = this.get('store').createRecord('editor-document');
    newDocument.setProperties({
      content: editorDocument.get('content'),
      context: editorDocument.get('context'),
      status: publishStatus,
      createdOn: editorDocument.get('createdOn'),
      title: editorDocument.get('title'),
      previousVersion: editorDocument});
    await newDocument.save();
    return newDocument;
  },

  async publishFlow(newStatus){
    this.set('isProcessing', true);
    try {
      let editorDocument = this.get('editorDocument');
      let publishStatus = this.get('editorDocumentStatuses').findBy('id', this.get('statusIdMap')[newStatus]);
      let newDocument = await this.publishDocument(editorDocument, publishStatus);
      let apiEndPoint = this.get('statusPublishApiEndPoint')[newStatus];
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

   async saveNewEditorDocument(){
     let editorDocument = this.get('editorDocument');

     if(this.hasDocumentValidationErrors(editorDocument)){
       this.set('validationErrors', true);
       return;
     }

     await this.saveEditorDocument(editorDocument);
     this.transitionToRoute('/editor-documents/' + editorDocument.get('id') + '/edit');
   },

   async saveExistingEditorDocument(){
     let editorDocument = this.get('editorDocument');


     if(this.hasDocumentValidationErrors(editorDocument)){
       this.set('validationErrors', true);
       return;
     }

     await this.saveEditorDocument(editorDocument);
   },

   sendToTrash(){
     this.set('publishModalStatus', 'trashStatusId');
     this.set('displayPublishStatusModal', true);
   },

   publishAgenda(){
     if(this.hasDocumentValidationErrors(this.get('editorDocument'))){
       this.set('validationErrors', true);
       return;
     }

     this.set('publishModalStatus', 'agendaPublishedStatusId');
     this.set('displayPublishStatusModal', true);
   },

   publishBesluitenlijst(){
     this.set('publishModalStatus', 'besluitenlijstPublishedStatusId');
     this.set('displayPublishStatusModal', true);
   },

   publishSignedNotulen(){
     this.set('publishModalStatus', 'signedPublishedStatusId');
     this.set('displayPublishStatusModal', true);
   },

   async terminatePublishFlow(){
     let publishModalStatus = this.get('publishModalStatus');
     this.resetPublishStatusModal();
     this.publishFlow(publishModalStatus);
   },

   onClosePublishStatusModal(){
     this.resetPublishStatusModal();
   },

   closeValidationModal(){
     this.set('validationErrors', false);
   }

 }
});
