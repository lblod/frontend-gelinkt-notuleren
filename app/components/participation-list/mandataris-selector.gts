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
import PowerSelect from 'ember-power-select/components/power-select';
import type MandatarisModel from 'frontend-gelinkt-notuleren/models/mandataris';
import type BestuursorgaanModel from 'frontend-gelinkt-notuleren/models/bestuursorgaan';
import type ZittingModel from 'frontend-gelinkt-notuleren/models/zitting';
import type StoreService from 'frontend-gelinkt-notuleren/services/gn-store';
import t from 'ember-intl/helpers/t';
import plainDate from 'frontend-gelinkt-notuleren/helpers/plain-date';
import { unwrap } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';

const GOVERNOR_CLASSIFICATION =
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/180a2fba-6ca9-4766-9b94-82006bb9c709';
const DEPUTATION_CLASSIFICATION =
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e00000d';

const SEARCH_DEBOUNCE_MS = 300;

type MandatarisSelectorSig = {
  Args: {
    bestuursorgaan: BestuursorgaanModel;
    meeting: ZittingModel;
    mandataris?: MandatarisModel;
    onSelect: (mandataris: MandatarisModel) => unknown;
  };
};
export default class MandatarisSelector extends Component<MandatarisSelectorSig> {
  @service declare store: StoreService;

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
  select(mandataris: MandatarisModel) {
    this.args.onSelect(mandataris);
  }

  async searchMandateesByName(searchData: string) {
    const queryParams = {
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
        ':lte:start': this.startOfMeeting?.toISOString(),
        ':or:': {
          ':has-no:einde': true,
          ':gt:einde': this.startOfMeeting?.toISOString(),
        },
        ':has:is-bestuurlijke-alias-van': true,
      },
      page: { size: 100 },
    };
    const mandatees = [
      // @ts-expect-error fix query-param types
      ...(await this.store.query<MandatarisModel>('mandataris', queryParams)),
    ];
    if (this.isInaugurationMeeting) {
      const commonBestuursorgaan = unwrap(
        await this.bestuursorgaanIT.isTijdsspecialisatieVan,
      );
      // In case this is an inauguration meeting, we also want to include the chairman of the previous legislation
      const currentBestuursperiode =
        await this.bestuursorgaanIT.bestuursperiode;
      const previousBestuursperiode = await currentBestuursperiode?.previous;
      if (previousBestuursperiode) {
        const voorzittersPreviousLegislation = [
          ...(await this.store.query<MandatarisModel>('mandataris', {
            // @ts-expect-error fix query-param types
            include: [
              'is-bestuurlijke-alias-van',
              'is-bestuurlijke-alias-van.geboorte',
              'status',
              'bekleedt',
              'bekleedt.bestuursfunctie',
            ].join(','),
            // @ts-expect-error fix query-param types
            filter: {
              bekleedt: {
                'bevat-in': {
                  'is-tijdsspecialisatie-van': {
                    ':uri:': commonBestuursorgaan.uri,
                  },
                  bestuursperiode: {
                    ':uri:': previousBestuursperiode?.uri,
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
                ':gt:einde': this.startOfMeeting?.toISOString(),
              },
              ':has:is-bestuurlijke-alias-van': true,
            },
          })),
        ];
        if (voorzittersPreviousLegislation.length) {
          mandatees.push(unwrap(voorzittersPreviousLegislation[0]));
        }
      }
    }
    return mandatees;
  }

  async searchGovernorsByName(searchData: string) {
    const adminUnit = unwrap(
      await this.bestuursorgaanIT.isTijdsspecialisatieVan.then(
        (bestuursorgaan) => bestuursorgaan?.bestuurseenheid,
      ),
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
        ':lte:start': this.startOfMeeting?.toISOString(),
        ':or:': {
          ':has-no:einde': true,
          ':gt:einde': this.startOfMeeting?.toISOString(),
        },
        ':has:is-bestuurlijke-alias-van': true,
      },
      page: { size: 100 },
    };
    return [
      // @ts-expect-error fix query-param types
      ...(await this.store.query<MandatarisModel>('mandataris', queryParams)),
    ];
  }

  async isDeputation(adminBody: BestuursorgaanModel) {
    const classification = await adminBody.isTijdsspecialisatieVan.then(
      (tijdsspecialisatie) => tijdsspecialisatie?.classificatie,
    );
    return classification?.uri === DEPUTATION_CLASSIFICATION;
  }

  searchByName = restartableTask(async (searchData: string) => {
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

  <template>
    <PowerSelect
      @loadingMessage={{t 'participation-list-modal-selector.loading-message'}}
      @noMatchesMessage={{t
        'participation-list-modal-selector.no-matches-message'
      }}
      @searchEnabled={{true}}
      @searchMessage={{t 'participation-list-modal-selector.search-message'}}
      @renderInPlace={{true}}
      @placeholder={{t 'participation-list-modal-selector.placeholder'}}
      @allowClear={{true}}
      @search={{this.searchByName.perform}}
      @selected={{@mandataris}}
      @onChange={{this.select}}
      as |mandataris|
    >
      {{mandataris.isBestuurlijkeAliasVan.gebruikteVoornaam}}
      {{mandataris.isBestuurlijkeAliasVan.achternaam}},
      {{mandataris.bekleedt.bestuursfunctie.label}}
      ({{plainDate mandataris.start}}
      -
      {{plainDate mandataris.einde}})
    </PowerSelect>
  </template>
}
