import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import FileSaverMixin from 'ember-cli-file-saver/mixins/file-saver';

export default Component.extend(FileSaverMixin, {
  router: service(),

  isWorking: computed('updateDocument.isRunning', 'uploadFileAndReplace.isRunning', 'saveDocument.isRunning', function(){
    return this.saveDocument.isRunning || this.uploadFileAndReplace.isRunning || this.saveDocument.isRunning;
  }),

  outputId: computed('id', function() {
     return `output-editor-document-${this.elementId}`;
   }),

  updateDocument: task(function *() {
    this.document.set('content', document.getElementById(this.outputId).textContent);
    yield this.document.save();
  }),

  saveDocument: task(function *() {
    yield this.document.save();
  }),

  //hack hack
  uploadFileAndReplace: task(function * (file) {
    let reader = new FileReader();
    yield new Promise(resolve => {
      let content = '';
      reader.onload = event => {
        content = event.target.result;
        console.log(event.target.result);
        this.document.set('content', content);
        resolve();
      };
      reader.readAsText(file);
    });
  }),

  actions: {

    toggleReplaceUris(){
      this.toggleProperty('replaceUrisMode');
    },

    toggleFileUpload(){
      this.toggleProperty('uploadFileMode');
    },

    //hack hack
    uploadFileAndReplace(uploadEvent){
      const file = uploadEvent.target.files[0];
      this.uploadFileAndReplace.perform(file);
    },

    generateFileDownload(){
       this.saveFileAs(`raw_document_content_${this.document.id}.txt`, this.document.content, 'text/plain');
    },

    toggleDisplayRaw(){
      this.toggleProperty('displayRaw');
    },
    save(){
      this.saveDocument.perform();
    },

    update(){
      this.updateDocument.perform();
    },
    next(){
      this.router.transitionTo('editor-documents.raw', this.document.nextVersion);
    },
    previous(){
      this.router.transitionTo('editor-documents.raw', this.document.previousVersion);
    }
  }
});
