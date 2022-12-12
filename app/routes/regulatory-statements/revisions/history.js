import Route from '@ember/routing/route';

export default class RegulatoryStatementsRevisionsHistoryRoute extends Route {
  model() {
    const { documentContainer, currentVersion } = this.modelFor(
      'regulatory-statements.revisions'
    );
    return {
      documentContainer,
      currentVersion,
    };
  }
}
