import Controller from '@ember/controller';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import type AgendapointsShowRoute from 'frontend-gelinkt-notuleren/routes/agendapoints/show';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';

export default class AgendapointsShowController extends Controller {
  @service declare currentSession: CurrentSessionService;
  @service declare router: RouterService;

  declare model: ModelFrom<AgendapointsShowRoute>;

  copyAgendapunt = task(async () => {
    const response = await fetch(
      `/agendapoint-service/${this.model.documentContainer.id}/copy`,
      { method: 'POST' },
    );
    const json = (await response.json()) as { uuid: string };
    const agendapuntId = json.uuid;
    await this.router.transitionTo('agendapoints.edit', agendapuntId);
  });

  get readOnly() {
    return !this.currentSession.canWrite && this.currentSession.canRead;
  }
}
