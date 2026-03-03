import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';
import RSVP from 'rsvp';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type Transition from '@ember/routing/transition';
import type StoreService from 'frontend-gelinkt-notuleren/services/gn-store';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';
import type AgendapointsRoute from '../agendapoints';
import type EditorDocumentModel from 'frontend-gelinkt-notuleren/models/editor-document';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';

export default class AgendapointsRevisionsRoute extends Route {
  @service declare store: StoreService;
  @service declare router: RouterService;
  @service declare currentSession: CurrentSessionService;

  beforeModel(transition: Transition) {
    if (!this.currentSession.canWrite) {
      const id = transition.to?.parent?.params?.['id'];
      this.router.transitionTo('agendapoints.show', id);
      return;
    }
  }

  async model() {
    const { documentContainer, editorDocument } = this.modelFor(
      'agendapoints',
    ) as ModelFrom<AgendapointsRoute>;
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
