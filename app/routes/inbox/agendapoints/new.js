import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class InboxAgendapointsNewRoute extends Route {
  @service currentSession;
  @service router;
  @service standardTemplatePlugin;

  beforeModel() {
    if (!this.currentSession.canWrite) {
      this.router.replaceWith('inbox.agendapoints');
    }
  }

  async model() {
    const templates =
      await this.standardTemplatePlugin.fetchTemplates.perform();
    return this.standardTemplatePlugin.templatesForContext(templates, [
      'http://data.vlaanderen.be/ns/besluit#BehandelingVanAgendapunt',
    ]);
  }
}
