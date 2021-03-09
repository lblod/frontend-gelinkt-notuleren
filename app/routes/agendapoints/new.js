import Route from '@ember/routing/route';

export default class AgendapointsNewRoute extends Route {
  model() {
    return this.store.createRecord('editor-document');
  }
}
