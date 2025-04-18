import { service } from '@ember/service';
import Component from '@glimmer/component';
import { trackedFunction } from 'reactiveweb/function';

const VALID_ADMINISTRATIVE_BODY_CLASSIFICATIONS = [
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000005', //	"Gemeenteraad"
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000007', //	"Raad voor Maatschappelijk Welzijn"
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000009', //	"Bijzonder Comité voor de Sociale Dienst"
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e00000a', //	"Districtsraad"
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e00000c', //	"Provincieraad"
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/53c0d8cd-f3a2-411d-bece-4bd83ae2bbc9', //	"Voorzitter van het Bijzonder Comité voor de Sociale Dienst"
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/9314533e-891f-4d84-a492-0338af104065', //	"Districtsburgemeester"
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e00000b', //	"Districtscollege"
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/180a2fba-6ca9-4766-9b94-82006bb9c709', //	"Gouverneur"
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/e14fe683-e061-44a2-b7c8-e10cab4e6ed9', //	"Voorzitter van de Raad voor Maatschappelijk Welzijn"
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000006', //	"College van Burgemeester en Schepenen"
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/4c38734d-2cc1-4d33-b792-0bd493ae9fc2', //	"Voorzitter van de Gemeenteraad"
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e00000d', //	"Deputatie"
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/4955bd72cd0e4eb895fdbfab08da0284', //	"Burgemeester"
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000008', //	"Vast Bureau"
];

/**
 * @typedef {Object} Args
 *
 * @property {string} id Input id so it can be linked with a label
 * @property {BestuursOrgaan} selected which governing body is currently selected
 * @property {(administrativeBody: BestuursOrgaan) => void} onChange change handler called when a body is selected
 * @property {boolean} error whether there is a form value error and we should render as such
 * @property {Date|undefined} referenceDate the reference date to use when determining the currently active bodies
 */

/** @extends {Component<Args>} */
export default class AdministrativeBodySelectComponent extends Component {
  @service currentSession;
  @service store;

  get referenceDate() {
    return this.args.referenceDate || new Date();
  }

  administrativeBodyOptions = trackedFunction(this, async () => {
    let currentAdministrativeUnitId = this.currentSession.group.id;
    const referenceDate = this.referenceDate;
    let administrativeBodiesInTime = await this.store.countAndFetchAll(
      'bestuursorgaan',
      {
        'filter[is-tijdsspecialisatie-van][bestuurseenheid][id]':
          currentAdministrativeUnitId,
        include: [
          'is-tijdsspecialisatie-van.bestuurseenheid',
          'is-tijdsspecialisatie-van.classificatie',
        ].join(),
        sort: '-binding-start',
      },
    );

    return administrativeBodiesInTime.filter((administrativeBodyInTime) => {
      const classificationUrl = administrativeBodyInTime.get(
        'isTijdsspecialisatieVan.classificatie.uri',
      );
      const bodyIsValid =
        VALID_ADMINISTRATIVE_BODY_CLASSIFICATIONS.includes(classificationUrl);
      // shortcutting to avoid work
      if (!bodyIsValid) {
        return false;
      }
      return administrativeBodyInTime.isActive(referenceDate);
    });
  });
}
