import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class InboxAgendapointsNewRoute extends Route {
  @service currentSession;
  @service router;
  @service standardTemplate;
  @service templateFetcher;

  beforeModel() {
    if (!this.currentSession.canWrite) {
      this.router.replaceWith('inbox.agendapoints');
    }
  }

  async model() {
    const templates = await this.standardTemplate.fetchTemplates.perform();
    const standardTemplates = this.standardTemplate.templatesForContext(
      templates,
      ['http://data.vlaanderen.be/ns/besluit#BehandelingVanAgendapunt'],
    );
    const dynamicTemplates = await this.templateFetcher.fetch.perform({
      templateType:
        'http://data.lblod.info/vocabularies/gelinktnotuleren/BesluitTemplate',
    });
    return [...standardTemplates, ...dynamicTemplates];
  }
}
