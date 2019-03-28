import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.find('versioned-behandeling', params.id);
  },
  async setupController(controller, model) {
    this._super(controller, model);

    if (model.content) {
      const div = document.createElement('div');
      div.innerHTML = model.content;

      const bestuursorgaanEl = div.querySelector("[property='http://data.vlaanderen.be/ns/besluit#isGehoudenDoor']");
      if (bestuursorgaanEl && bestuursorgaanEl.attributes['resource']) {
        const bestuursorgaanUri = bestuursorgaanEl.attributes['resource'].value;
        const bestuursorganen = await this.store.query('bestuursorgaan', {
          'filter[heeft-tijdsspecialisaties][:uri:]': bestuursorgaanUri
        });
        if (bestuursorganen.length)
          controller.set('bestuursorgaan', bestuursorganen.firstObject);
      }

      const geplandeStartEl = div.querySelector("[property='http://data.vlaanderen.be/ns/besluit#geplandeStart']");
      if (geplandeStartEl && geplandeStartEl.attributes['content']) {
        const geplandeStart = Date.parse(geplandeStartEl.attributes['content'].value);
        if (geplandeStart)
          controller.set('geplandeStart', geplandeStart);
      }
    }
  }
});
