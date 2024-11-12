import Component from '@glimmer/component';
import { action } from '@ember/object';
import { all, restartableTask, timeout } from 'ember-concurrency';
import { service } from '@ember/service';
import {
  MANDATARIS_STATUS_EFFECTIEF,
  MANDATARIS_STATUS_WAARNEMEND,
} from '../../utils/constants';
import { BESTUURSFUNCTIE_CODES } from '../../config/constants';
import InstallatieVergaderingModel from 'frontend-gelinkt-notuleren/models/installatievergadering';
import { getIdentifier } from '../../utils/rdf-utils';

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

  get bestuursorgaanIT() {
    return this.args.bestuursorgaan;
  }

  get meeting() {
    return this.args.meeting;
  }

  get startOfMeeting() {
    return this.meeting.gestartOpTijdstip ?? this.meeting.geplandeStart;
  }

  get isInaugurationMeeting() {
    return this.meeting instanceof InstallatieVergaderingModel;
  }

  @action
  select(value) {
    this.args.onSelect(value);
  }

  async searchMandateesByName(searchData) {
    let queryParams = {
      sort: 'is-bestuurlijke-alias-van.achternaam',
      include: 'is-bestuurlijke-alias-van,bekleedt.bestuursfunctie',
      filter: {
        bekleedt: {
          'bevat-in': {
            ':uri:': this.bestuursorgaanIT.uri,
          },
        },
        'is-bestuurlijke-alias-van': searchData,
        status: {
          ':id:': [
            MANDATARIS_STATUS_EFFECTIEF,
            MANDATARIS_STATUS_WAARNEMEND,
          ].join(','),
        },
        ':lte:start': this.startOfMeeting.toISOString(),
        ':or:': {
          ':has-no:einde': true,
          ':gt:einde': this.startOfMeeting.toISOString(),
        },
        ':has:is-bestuurlijke-alias-van': true,
      },
      page: { size: 100 },
    };
    const mandatees = [...(await this.store.query('mandataris', queryParams))];
    if (this.isInaugurationMeeting) {
      const commonBestuursorgaan =
        await this.bestuursorgaanIT.isTijdsspecialisatieVan;
      // In case this is an inauguration meeting, we also want to include the chairman of the previous legislation
      const currentBestuursperiode =
        await this.bestuursorgaanIT.bestuursperiode;
      const previousBestuursperiode = await currentBestuursperiode.previous;
      if (previousBestuursperiode) {
        const voorzittersPreviousLegislation = [
          ...(await this.store.query('mandataris', {
            include: [
              'is-bestuurlijke-alias-van',
              'is-bestuurlijke-alias-van.geboorte',
              'status',
              'bekleedt',
              'bekleedt.bestuursfunctie',
            ].join(','),
            filter: {
              bekleedt: {
                'bevat-in': {
                  'is-tijdsspecialisatie-van': {
                    ':uri:': commonBestuursorgaan.uri,
                  },
                  bestuursperiode: {
                    ':uri:': previousBestuursperiode.uri,
                  },
                },
                bestuursfunctie: {
                  ':id:': [
                    getIdentifier(
                      BESTUURSFUNCTIE_CODES.VOORZITTER_GEMEENTERAAD,
                    ),
                    getIdentifier(
                      BESTUURSFUNCTIE_CODES.VOORZITTER_RAAD_MAATSCHAPPELIJK_WELZIJN,
                    ),
                    getIdentifier(
                      BESTUURSFUNCTIE_CODES.VOORZITTER_DISTRICTSRAAD,
                    ),
                  ].join(','),
                },
              },
              status: {
                ':id:': [
                  MANDATARIS_STATUS_EFFECTIEF,
                  MANDATARIS_STATUS_WAARNEMEND,
                ].join(','),
              },
              ':or:': {
                ':has-no:einde': true,
                ':gt:einde': this.startOfMeeting.toISOString(),
              },
              ':has:is-bestuurlijke-alias-van': true,
            },
          })),
        ];
        if (voorzittersPreviousLegislation.length) {
          mandatees.push(voorzittersPreviousLegislation[0]);
        }
      }
    }
    return mandatees;
  }

  async searchGovernorsByName(searchData) {
    const adminUnit = await this.bestuursorgaanIT.get(
      'isTijdsspecialisatieVan.bestuurseenheid',
    );
    const queryParams = {
      sort: 'is-bestuurlijke-alias-van.achternaam',
      include: 'is-bestuurlijke-alias-van,bekleedt.bestuursfunctie',
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
        status: {
          ':id:': [
            MANDATARIS_STATUS_EFFECTIEF,
            MANDATARIS_STATUS_WAARNEMEND,
          ].join(','),
        },
        ':lte:start': this.startOfMeeting.toISOString(),
        ':or:': {
          ':has-no:einde': true,
          ':gt:einde': this.startOfMeeting.toISOString(),
        },
        ':has:is-bestuurlijke-alias-van': true,
      },
      page: { size: 100 },
    };
    return [...(await this.store.query('mandataris', queryParams))];
  }

  async isDeputation(adminBody) {
    const classification = await adminBody.get(
      'isTijdsspecialisatieVan.classificatie',
    );
    return classification.uri === DEPUTATION_CLASSIFICATION;
  }

  searchByName = restartableTask(async (searchData) => {
    await timeout(SEARCH_DEBOUNCE_MS);
    const isDeputation = await this.isDeputation(this.bestuursorgaanIT);
    let mandatees;
    if (isDeputation) {
      const [mandateeResults, governorResults] = await all([
        this.searchMandateesByName(searchData),
        this.searchGovernorsByName(searchData),
      ]);
      mandatees = mandateeResults;
      mandatees.push(...governorResults);
    } else {
      mandatees = await this.searchMandateesByName(searchData);
    }
    return mandatees;
  });
}
