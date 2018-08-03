import RSVP from 'rsvp';
import Route from '@ember/routing/route';

export default Route.extend({
  model(){
   return RSVP.hash({
     editorDocument: this.store.createRecord('editor-document'),
     editorDocumentStatuses: this.store.findAll('editor-document-status')
    });
  }
});
