import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
export default Route.extend(AuthenticatedRouteMixin, {
  currentSession: service(),
  store: service(),
  async model() {
    const eenheid = await this.currentSession.group;
    const bestuursorganen = await this.store.query('bestuursorgaan', {filter: {
      "is-tijdsspecialisatie-van": {
        bestuurseenheid: {':id:': eenheid.id},
        "classificatie": {':uri:': 'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000005'}
      }
    }});
    const bestuursorgaan = bestuursorganen.find((r) =>  r.bindingStart == "2019-01-01");
    const resultaten = await this.store.query('verkiezingsresultaat', {
      filter: {
        'is-resultaat-voor': { 'rechtstreekse-verkiezing': {'stelt-samen': {':id:': bestuursorgaan.id }}},
        'gevolg': {':uri:': 'http://data.vlaanderen.be/id/concept/VerkiezingsresultaatGevolgCode/89498d89-6c68-4273-9609-b9c097727a0f' }
      },
      include: 'is-resultaat-van,is-resultaat-voor',
      page: {
        number: 0,
        size: 100
      }
    });
    return {resultaten , bestuursorgaan, eenheid};
  }
});
