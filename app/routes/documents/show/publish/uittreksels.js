import { inject } from '@ember/service';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import Object from '@ember/object';

export default Route.extend({
  ajax: inject(),
  async model(){
    const documentContainer = this.modelFor('documents.show');
    const document = await documentContainer.get('currentVersion');
    return RSVP.hash({
      editorDocument: document,
      mockBehandelingen: this.ajax.request(`/prepublish/behandelingen/${document.id}`).then(
        (res) => res.data.map(
          (record) => Object.create(record.attributes)
        )
      )
    });
  }
});
