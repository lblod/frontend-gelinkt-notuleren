import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class InboxAgendapointsNewRoute extends Route {
  @service currentSession;
  @service router;
  @service rdfaEditorStandardTemplatePlugin;

  beforeModel() {
    if (!this.currentSession.canWrite) {
      this.router.replaceWith('inbox.agendapoints');
    }
  }

  async model() {
    const templates =
      await this.rdfaEditorStandardTemplatePlugin.fetchTemplates.perform();
    return this.rdfaEditorStandardTemplatePlugin.templatesForContext(
      templates,
      ['http://data.vlaanderen.be/ns/besluit#BehandelingVanAgendapunt']
    );
  }
}
