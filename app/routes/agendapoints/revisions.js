import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default class AgendapointsRevisionsRoute extends Route {
  @service store;
  @service router;

  async model() {
    const { documentContainer, returnToMeeting } =
      this.modelFor('agendapoints');
    const editorDocument = await documentContainer.currentVersion;
    return RSVP.hash({
      revisions: this.fetchRevisions.perform(editorDocument),
      documentContainer,
      editorDocument,
      returnToMeeting,
    });
  }

  fetchRevisions = task(async (currentVersion) => {
    let revisions = [currentVersion];
    let revision = await currentVersion.get('previousVersion');
    while (revision) {
      revisions.push(revision);
      revision = await revision.get('previousVersion');
    }
    return revisions;
  });

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.revisionDetail = model.revisions[0];
  }
}
