import RSVP from 'rsvp';
import Route from '@ember/routing/route';

export default Route.extend({
  setupController (controller, model){
    this._super(controller, model);
    this.controllerFor('editorDocuments.revisions.index').fetchRevisions.perform();
  }
});
