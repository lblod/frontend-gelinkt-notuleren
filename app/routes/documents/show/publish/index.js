import Route from '@ember/routing/route';

export default Route.extend({
  activate(){
    this.transitionTo('documents.show.publish.agenda');
  }
});
