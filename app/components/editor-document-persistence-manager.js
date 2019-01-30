import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',
  statusIdMap: null,

  isTrashingAllowed: computed('editorDocument.status', function() {
    return this.get('editorDocument.status.id');
  }),
  actions:{
    save(){
      this.save();
    },
    publish(){
      this.publish();
    },

    sendToTrash(){
      this.sendToTrash();
    },

    startSyncModal(){
      this.onSync();
    }
  }
});
