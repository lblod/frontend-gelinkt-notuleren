import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
export default Route.extend(AuthenticatedRouteMixin, {
  currentSession: service(),
  store: service(),
  async model(params) {
    const eenheid = await this.currentSession.group;
    const eenheidType = await eenheid.classificatie;
    var classificatie;
    if (eenheidType.id === '5ab0e9b8a3b2ca7c5e000001')
      classificatie = 'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000005';
    else if (eenheidType.id === '5ab0e9b8a3b2ca7c5e000000') // provincie
      classificatie = 'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e00000c';
    else if (eenheidType.id === '5ab0e9b8a3b2ca7c5e000003') // district
      classificatie = 'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e00000a';
    else
      return {eenheid, resultaten: []};
    const bestuursorganen = await this.store.query('bestuursorgaan', {filter: {
      "is-tijdsspecialisatie-van": {
        bestuurseenheid: {':id:': eenheid.id},
        "classificatie": {':uri:': classificatie}
      },
      "binding-start": "2019-01-01"
    }});
    const bestuursorgaan = bestuursorganen.firstObject;
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
