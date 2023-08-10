import Route from '@ember/routing/route';

export default class RegulatoryStatementsEditHistoryRoute extends Route {
  model() {
    const { documentContainer, editorDocument } = this.modelFor(
      'regulatory-statements.edit',
    );
    return {
      documentContainer,
      editorDocument,
    };
  }
}
