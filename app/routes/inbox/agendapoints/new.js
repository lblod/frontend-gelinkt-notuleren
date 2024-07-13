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
    const standardTemplatesPromise = this.standardTemplate.fetchTemplates
      .perform()
      .then((standardTemplates) => {
        return this.standardTemplate.templatesForContext(standardTemplates, [
          'http://data.vlaanderen.be/ns/besluit#BehandelingVanAgendapunt',
        ]);
      });
    const dynamicTemplatesPromise = this.templateFetcher.fetch.perform({
      templateType:
        'http://data.lblod.info/vocabularies/gelinktnotuleren/BesluitTemplate',
    });
    return Promise.all([
      standardTemplatesPromise,
      dynamicTemplatesPromise,
    ]).then((result) => result.flat());
  }
}
