import Component from '@glimmer/component';
import { action } from '@ember/object';
import { all, restartableTask, timeout } from 'ember-concurrency';
import { service } from '@ember/service';
import isValidMandateeForMeeting from 'frontend-gelinkt-notuleren/utils/is-valid-mandatee-for-meeting';

const GOVERNOR_CLASSIFICATION =
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/180a2fba-6ca9-4766-9b94-82006bb9c709';
const DEPUTATION_CLASSIFICATION =
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e00000d';

const SEARCH_DEBOUNCE_MS = 300;
/**
 * @typedef {Object} Args
 * @property {BestuursOrgaan} bestuursorgaan
 * @property {Zitting} meeting
 * @property {Mandataris} mandataris the selected mandataris
 * @property {(value: Mandataris) => void} onSelect called when mandataris is selected
 */

/** @extends {Component<Args>} */
export default class ParticipationListMandatarisSelectorComponent extends Component {
  @service store;

  get adminBody() {
    return this.args.bestuursorgaan;
  }

  @action
  select(value) {
    this.args.onSelect(value);
  }

  async searchMandateesOfAdminBodyByName(adminBody, searchData) {
    let queryParams = {
      sort: 'is-bestuurlijke-alias-van.achternaam',
      include: 'status',
      filter: {
        bekleedt: {
          'bevat-in': {
            ':uri:': adminBody.uri,
          },
        },
        'is-bestuurlijke-alias-van': searchData,
      },
      page: { size: 100 },
    };
    return this.store.query('mandataris', queryParams);
  }

  async searchGovernorsAdminUnitByName(adminUnit, searchData) {
    const queryParams = {
      sort: 'is-bestuurlijke-alias-van.achternaam',
      include: 'status',
      filter: {
        bekleedt: {
          'bevat-in': {
            'is-tijdsspecialisatie-van': {
              classificatie: {
                ':uri:': GOVERNOR_CLASSIFICATION,
              },
              bestuurseenheid: {
                ':uri:': adminUnit.uri,
              },
            },
          },
        },
        'is-bestuurlijke-alias-van': searchData,
      },
      page: { size: 100 },
    };
    return this.store.query('mandataris', queryParams);
  }

  async isDeputation(adminBody) {
    const classification = await adminBody.get(
      'isTijdsspecialisatieVan.classificatie',
    );
    return classification.uri === DEPUTATION_CLASSIFICATION;
  }

  searchByName = restartableTask(async (searchData) => {
    await timeout(SEARCH_DEBOUNCE_MS);
    const isDeputation = await this.isDeputation(this.adminBody);
    let mandatees;
    if (isDeputation) {
      const adminUnit = await this.args.bestuursorgaan.get(
        'isTijdsspecialisatieVan.bestuurseenheid',
      );
      const [mandateeResults, governorResults] = await all([
        this.searchMandateesOfAdminBodyByName(this.adminBody, searchData),
        this.searchGovernorsAdminUnitByName(adminUnit, searchData),
      ]);
      mandatees = mandateeResults.toArray();
      mandatees.push(...governorResults.toArray());
    } else {
      mandatees = await this.searchMandateesOfAdminBodyByName(
        this.adminBody,
        searchData,
      );
    }
    return mandatees.filter((mandatee) =>
      isValidMandateeForMeeting(mandatee, this.args.meeting),
    );
  });
}
