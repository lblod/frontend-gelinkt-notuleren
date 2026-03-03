import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';
import RSVP from 'rsvp';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type StoreService from 'frontend-gelinkt-notuleren/services/gn-store';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';
import type AgendapointsRoute from '../agendapoints';
import type EditorDocumentModel from 'frontend-gelinkt-notuleren/models/editor-document';

export default class AgendapointsRevisionsRoute extends Route {
  @service declare store: StoreService;
  @service declare router: RouterService;

  async model() {
    const { documentContainer } = this.modelFor(
      'agendapoints',
    ) as ModelFrom<AgendapointsRoute>;
    const editorDocument = await documentContainer.currentVersion;
    return RSVP.hash({
      revisions: this.fetchRevisions.perform(editorDocument),
      documentContainer,
      editorDocument,
    });
  }

  fetchRevisions = task(async (currentVersion: EditorDocumentModel | null) => {
    if (currentVersion) {
      const revisions = [currentVersion];
      let revision = await currentVersion.get('previousVersion');
      while (revision) {
        revisions.push(revision);
        revision = await revision.get('previousVersion');
      }
      return revisions;
    }
  });
}
