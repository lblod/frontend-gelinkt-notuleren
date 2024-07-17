import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class InboxRegulatoryStatementsNewRoute extends Route {
  @service currentSession;
  @service router;
  @service templateFetcher;

  beforeModel() {
    if (!this.currentSession.canWrite) {
      this.router.replaceWith('inbox.regulatory-statements');
    }
  }

  async model() {
    const templates = await this.templateFetcher.fetch.perform({
      templateType:
        'http://data.lblod.info/vocabularies/gelinktnotuleren/ReglementaireBijlageTemplate',
    });
    return templates;
  }
}
