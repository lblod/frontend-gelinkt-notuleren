import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    const id = this.modelFor('published.zitting').get('id');
    return this.get('store').findRecord('zitting', id, {
      include: 'bestuursorgaan,agenda,agenda.agendapunten'
    });
  }
});
