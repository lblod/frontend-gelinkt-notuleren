import RSVP from 'rsvp';
import Route from '@ember/routing/route';

export default Route.extend({
    model(params){
   return RSVP.hash({
     editorDocument: this.get('store').findRecord('editor-document', params.id, {include: 'status'}),
     editorDocumentStatuses: this.store.findAll('editor-document-status')
    });
  }
});
