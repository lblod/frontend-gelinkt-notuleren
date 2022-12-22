import Route from '@ember/routing/route';

export default class RegulatoryStatementsShowHistoryRoute extends Route {
  model() {
    const { documentContainer, editorDocument } = this.modelFor(
      'regulatory-statements.show'
    );
    return {
      documentContainer,
      editorDocument,
    };
  }
}
