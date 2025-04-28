import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';
import type StoreService from 'frontend-gelinkt-notuleren/services/gn-store';
import type ZittingModel from 'frontend-gelinkt-notuleren/models/zitting';
import BestuursorgaanModel from 'frontend-gelinkt-notuleren/models/bestuursorgaan';
import type FunctionarisModel from 'frontend-gelinkt-notuleren/models/functionaris';
import plainDate from 'frontend-gelinkt-notuleren/helpers/plain-date';
import t from 'ember-intl/helpers/t';
import PowerSelect from 'ember-power-select/components/power-select';

const PROVINCE_CLASSIFICATION_ID = '5ab0e9b8a3b2ca7c5e000000';
const GRIFFIER_CLASSIFICATION_ID = '5ab19107-82d2-4273-a986-3da86fda050d';
const ALGEMEEN_DIRECTEUR_CLASSIFICATION_ID =
  '39854196-f214-4688-87a1-d6ad12baa2fa';
const ADJUNCT_ALGEMEEN_DIRECTEUR_CLASSIFICATION_ID =
  '11f0af9e-016c-4e0b-983a-d8bc73804abc';

type FunctionarisSelectorSig = {
  Args: {
    meeting: ZittingModel;
    functionaris?: FunctionarisModel;
    onSelect: (functionaris: FunctionarisModel) => unknown;
  };
};
export default class FunctionarisSelector extends Component<FunctionarisSelectorSig> {
  @tracked options: FunctionarisModel[] = [];

  constructor(owner: unknown, args: FunctionarisSelectorSig['Args']) {
    super(owner, args);
    void this.loadData.perform();
  }

  @service declare store: StoreService;
  @service declare currentSession: CurrentSessionService;

  loadData = task(async () => {
    const group = this.currentSession.group;
    if (!group) {
      return [];
    }
    const adminUnitClassification = await group.classificatie;
    let relevantBestuursOrgaanClassifications = `${ALGEMEEN_DIRECTEUR_CLASSIFICATION_ID},${ADJUNCT_ALGEMEEN_DIRECTEUR_CLASSIFICATION_ID}`;
    if (adminUnitClassification?.id === PROVINCE_CLASSIFICATION_ID) {
      relevantBestuursOrgaanClassifications = GRIFFIER_CLASSIFICATION_ID;
    }
    const bestuursorganen = await this.store.query<BestuursorgaanModel>(
      'bestuursorgaan',
      {
        fields: {
          bestuursorganen: 'id',
        },
        filter: {
          'is-tijdsspecialisatie-van': {
            bestuurseenheid: { ':id:': group.id },
            classificatie: { ':id:': relevantBestuursOrgaanClassifications },
          },
        },
      },
    );
    const startOfMeeting =
      this.args.meeting.gestartOpTijdstip ?? this.args.meeting.geplandeStart;
    const queryParams = {
      include: ['is-bestuurlijke-alias-van', 'bekleedt', 'bekleedt.rol'].join(
        ',',
      ),
      sort: 'is-bestuurlijke-alias-van.achternaam',
      filter: {
        bekleedt: {
          'bevat-in': {
            ':id:': bestuursorganen.map((b) => b.id).join(','),
          },
        },
        ':lte:start': startOfMeeting?.toISOString(),
        ':or:': {
          ':has-no:einde': true,
          ':gt:einde': startOfMeeting?.toISOString(),
        },
        ':has:is-bestuurlijke-alias-van': true,
      },
    };

    const candidateOptions = await this.store.query<FunctionarisModel>(
      'functionaris',
      // @ts-expect-error fix types of query params
      queryParams,
    );
    this.options = candidateOptions;
  });

  <template>
    {{#if this.loadData.isRunning}}
      <p class='loader'><span class='u-visually-hidden'>{{t
            'participation-list.loading-title'
          }}</span></p>
    {{else}}
      <PowerSelect
        @options={{this.options}}
        @selected={{@functionaris}}
        @allowClear={{true}}
        @onChange={{@onSelect}}
        as |functionaris|
      >
        {{functionaris.isBestuurlijkeAliasVan.gebruikteVoornaam}}
        {{functionaris.isBestuurlijkeAliasVan.achternaam}},
        {{functionaris.bekleedt.rol.label}}
        ({{t 'participation-list.period-start'}}:
        {{plainDate functionaris.start}}
        -
        {{plainDate functionaris.einde}})
      </PowerSelect>
    {{/if}}
  </template>
}
