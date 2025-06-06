import RSVP from 'rsvp';
import Route from '@ember/routing/route';
import type RouterService from '@ember/routing/router-service';
import type Transition from '@ember/routing/transition';
import { service } from '@ember/service';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';
import type Store from 'frontend-gelinkt-notuleren/services/store';
import type StandardTemplateService from 'frontend-gelinkt-notuleren/services/standard-template';
import type DocumentContainerModel from 'frontend-gelinkt-notuleren/models/document-container';
import type { LegacyResourceQuery } from '@ember-data/store/types';
import type Features from 'ember-feature-flags';

export default class RegulatoryStatementsEditRoute extends Route {
  @service declare currentSession: CurrentSessionService;
  @service declare store: Store;
  @service declare router: RouterService;
  @service declare standardTemplate: StandardTemplateService;
  @service declare features: Features;

  beforeModel(transition: Transition) {
    if (!this.currentSession.canWrite) {
      const id = transition.to?.params?.['id'];
      this.router.transitionTo('regulatory-statements.show', id);
      return;
    }
  }

  async model(params: { id: string }) {
    const containerPromise = this.store.findRecord<DocumentContainerModel>(
      'document-container',
      params.id,
      {
        include: 'status',
      } as unknown as LegacyResourceQuery<DocumentContainerModel>,
    );
    const currentVersion = containerPromise.then((container) =>
      container.get('currentVersion'),
    );
    return RSVP.hash({
      meetingId: params.id,
      documentContainer: containerPromise,
      editorDocument: currentVersion,
      standardTemplates: this.standardTemplate.fetchTemplates.perform(),
      isCiterraPoc: this.features.isEnabled('citerra-poc'),
    });
  }
}
