import Route from '@ember/routing/route';

export default class PrintUittrekselRoute extends Route {
  async model(params) {
    return this.store.find('versioned-behandeling', params.id);
  }

  async afterModel(model) {
    this.zitting = await model.get('zitting');
    const tijdsspecialisatie = await this.zitting.get('bestuursorgaan');
    this.bestuursorgaan = tijdsspecialisatie.get('isTijdsspecialisatieVan');
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.bestuursorgaan = this.bestuursorgaan;
    controller.geplandeStart = this.zitting.geplandeStart;
  }
}
