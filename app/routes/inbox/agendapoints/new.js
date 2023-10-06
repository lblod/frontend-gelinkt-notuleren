import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class InboxAgendapointsNewRoute extends Route {
  @service currentSession;
  @service router;
  @service standardTemplate;

  beforeModel() {
    if (!this.currentSession.canWrite) {
      this.router.replaceWith('inbox.agendapoints');
    }
  }

  async model() {
    const templates = await this.standardTemplate.fetchTemplates.perform();
    return this.standardTemplate.templatesForContext(templates, [
      'http://data.vlaanderen.be/ns/besluit#BehandelingVanAgendapunt',
    ]);
  }
}
