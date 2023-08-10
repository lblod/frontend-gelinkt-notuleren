import Route from '@ember/routing/route';

export default class RegulatoryStatementsRevisionsHistoryRoute extends Route {
  model() {
    const { documentContainer, currentVersion, editorDocument } = this.modelFor(
      'regulatory-statements.revisions',
    );
    return {
      documentContainer,
      currentVersion,
      editorDocument,
    };
  }
}
