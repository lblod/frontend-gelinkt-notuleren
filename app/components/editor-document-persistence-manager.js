import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',
  statusIdMap: null,

  isTrashingAllowed: computed('editorDocument.status', function() {
    return this.get('editorDocument.status.id');
  }),

  isPublishAgendaAllowed: computed('editorDocument.status', function(){
    return this.get('editorDocument.status.id') === this.get('statusIdMap.conceptStatusId') || !this.get('editorDocument.status.id');
  }),

  isPublishBesluitenlijstAllowed: computed('editorDocument.status', function(){
    return this.get('editorDocument.status.id') === this.get('statusIdMap.agendaPublishedStatusId');
  }),

  isPublishSignedNotulenAllowed: computed('editorDocument.status', function(){
    return this.get('editorDocument.status.id') === this.get('statusIdMap.besluitenlijstPublishedStatusId');
  }),

  actions:{
    save(){
      this.get('save')();
    },

    publishAgenda(){
      this.get('publishAgenda')();
    },

    publishBesluitenlijst(){
      this.get('publishBesluitenlijst')();
    },

    publishSignedNotulen(){
      this.get('publishSignedNotulen')();
    },

    sendToTrash(){
      this.get('sendToTrash')();
    }
  }
});
