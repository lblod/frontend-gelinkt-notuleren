import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service(),

  outputId: computed('id', function() {
     return `output-editor-document-${this.elementId}`;
   }),

  saveDocument: task(function * () {
    this.document.set('content', document.getElementById(this.outputId).textContent);
    yield this.document.save();
  }),

  actions: {
    save(){
      this.saveDocument.perform();
    },
    next(){
      this.router.transitionTo('editor-documents.raw', this.document.nextVersion);
    },
    previous(){
      this.router.transitionTo('editor-documents.raw', this.document.previousVersion);
    }
  }
});
