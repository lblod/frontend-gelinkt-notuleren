import Route from '@ember/routing/route';

export default class PrintUittrekselRoute extends Route {
  async model(params) {
    return this.store.findRecord('versioned-behandeling', params.id, {
      include: 'zitting.bestuursorgaan.is-tijdsspecialisatie-van,signed-resources.gebruiker'
    });
  }
}
