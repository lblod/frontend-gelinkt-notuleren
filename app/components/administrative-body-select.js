import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import sub from 'date-fns/sub';
import isAfter from 'date-fns/isAfter';

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
 */

/** @extends {Component<Args>} */
export default class AdministrativeBodySelectComponent extends Component {
  @service currentSession;
  @service store;
  @tracked administrativeBodyOptions = [];

  constructor() {
    super(...arguments);

    this.fetchAdministrativeBodies.perform();
  }

  /**
   * Fetch bodies which are of the right classification, and whose
   * end date is not older than 2 months before the current date
   */
  @task
  *fetchAdministrativeBodies() {
    let currentAdministrativeUnitId = this.currentSession.group.id;

    let administrativeBodiesInTime = yield this.store.query('bestuursorgaan', {
      'filter[is-tijdsspecialisatie-van][bestuurseenheid][id]':
        currentAdministrativeUnitId,
      include: [
        'is-tijdsspecialisatie-van.bestuurseenheid',
        'is-tijdsspecialisatie-van.classificatie',
      ].join(),
      sort: '-binding-start',
    });

    this.administrativeBodyOptions = administrativeBodiesInTime.filter(
      (administrativeBodyInTime) => {
        const classificationUrl = administrativeBodyInTime.get(
          'isTijdsspecialisatieVan.classificatie.uri'
        );
        const bodyIsValid =
          VALID_ADMINISTRATIVE_BODY_CLASSIFICATIONS.includes(classificationUrl);
        // shortcutting to avoid work
        if (!bodyIsValid) {
          return false;
        }

        const endDate = administrativeBodyInTime.bindingEinde;
        if (!endDate) {
          return true;
        }
        const twoMonthsAgo = sub(new Date(), { months: 2 });
        return isAfter(endDate, twoMonthsAgo);
      }
    );
  }
}
