import type { LegacyResourceQuery } from '@ember-data/store/types';
import Route from '@ember/routing/route';
import type Transition from '@ember/routing/transition';
import { service } from '@ember/service';
import DocumentContainerModel from 'frontend-gelinkt-notuleren/models/document-container';
import type SessionService from 'frontend-gelinkt-notuleren/services/gn-session';
import type StoreService from 'frontend-gelinkt-notuleren/services/gn-store';

export default class AgendapointsRoute extends Route {
  @service declare session: SessionService;
  @service declare store: StoreService;

  beforeModel(transition: Transition) {
    this.session.requireAuthentication(transition, 'login');
  }

  async model(params: { id: string }) {
    const container = await this.store.findRecord<DocumentContainerModel>(
      'document-container',
      params.id,
      {
        include: 'status',
      } as unknown as LegacyResourceQuery<DocumentContainerModel>,
    );

    return {
      documentContainer: container,
      editorDocument: await container.currentVersion,
    };
  }
}
