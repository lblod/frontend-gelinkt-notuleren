import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class InboxRegulatoryStatementsNewRoute extends Route {
  @service currentSession;
  @service router;
  @service rdfaEditorStandardTemplatePlugin;

  beforeModel() {
    if (!this.currentSession.canWrite) {
      this.router.replaceWith('inbox.regulatory-statements');
    }
  }

  async model() {
    const templates = [{ title: 'Vrije ingave', body: '' }];
    return templates;
  }
}
