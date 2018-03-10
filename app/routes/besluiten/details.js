import Route from '@ember/routing/route';

export default Route.extend({
  model(params){
    return this.get('store').findRecord('besluit', params.id, {include: 'afgeleid-uit-notule'});
  }
});
