import RSVP from 'rsvp';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentSession: service(),

  async model(){
    const bestuurseenheid = await this.get('currentSession.group');
    return RSVP.hash({
      editorDocument: this.store.createRecord('editor-document'),
      editorDocumentStatuses: this.store.findAll('editor-document-status'),
      bestuurseenheidClassificatie: bestuurseenheid.get('classificatie')
     });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('profile', model.bestuurseenheidClassificatie.get('uri'));
  }
});
