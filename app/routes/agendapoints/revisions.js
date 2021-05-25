import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';
import RSVP from 'rsvp';
export default class AgendapointsRevisionsRoute extends Route {
  async model(params) {
    const container = await this.store.findRecord('documentContainer', params.id);
    const editorDocument = await container.get('currentVersion');
    return RSVP.hash({
      revisions: this.fetchRevisions.perform(editorDocument),
      container,
      editorDocument
    });
  }

  @task
  *fetchRevisions(currentVersion) {
    let revisions = [ currentVersion ];
    let revision = yield currentVersion.get('previousVersion');
    while (revision) {
      revisions.push(revision);
      revision = yield revision.get('previousVersion');
    }
    return revisions;
  }
}
