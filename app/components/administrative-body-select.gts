import { service } from '@ember/service';
import Component from '@glimmer/component';
import { trackedFunction } from 'reactiveweb/function';
import BestuursorgaanModel from 'frontend-gelinkt-notuleren/models/bestuursorgaan';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';
import type Store from 'frontend-gelinkt-notuleren/services/gn-store';
import { unwrap } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import { filterAsync } from 'frontend-gelinkt-notuleren/utils/filter';
import type { LegacyResourceQuery } from '@ember-data/store/types';
import PowerSelect from 'ember-power-select/components/power-select';
import t from 'ember-intl/helpers/t';
import type { TOC } from '@ember/component/template-only';

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

type Signature = {
  Args: {
    id: string;
    selected: BestuursorgaanModel;
    onChange: (administrativeBody: BestuursorgaanModel) => unknown;
    error: boolean;
    referenceDate?: Date;
  };
};

export default class AdministrativeBodySelectComponent extends Component<Signature> {
  @service declare currentSession: CurrentSessionService;
  @service declare store: Store;

  get referenceDate() {
    return this.args.referenceDate || new Date();
  }

  administrativeBodyOptions = trackedFunction(this, async () => {
    const currentAdministrativeUnitId = unwrap(this.currentSession.group?.id);
    const referenceDate = this.referenceDate;
    const administrativeBodiesInTime = (
      await this.store.countAndFetchAll<BestuursorgaanModel>('bestuursorgaan', {
        'filter[is-tijdsspecialisatie-van][bestuurseenheid][id]':
          currentAdministrativeUnitId,
        include: [
          'is-tijdsspecialisatie-van.bestuurseenheid',
          'is-tijdsspecialisatie-van.classificatie',
        ].join(),
        sort: '-binding-start',
      } as unknown as LegacyResourceQuery<BestuursorgaanModel>)
    ).content;

    return filterAsync(
      administrativeBodiesInTime,
      async (administrativeBodyInTime: BestuursorgaanModel) => {
        const administrativeBody = unwrap(
          await administrativeBodyInTime.isTijdsspecialisatieVan,
        );
        const classification = unwrap(await administrativeBody.classificatie);

        const bodyIsValid = VALID_ADMINISTRATIVE_BODY_CLASSIFICATIONS.includes(
          unwrap(classification.uri),
        );
        // shortcutting to avoid work
        if (!bodyIsValid) {
          return false;
        }
        return administrativeBodyInTime.isActive(referenceDate);
      },
    );
  });

  <template>
    <div class={{if @error 'ember-power-select--error'}}>
      {{#if this.administrativeBodyOptions.value}}
        <PowerSelect
          @placeholder={{t 'manage-zittings-data.select-placeholder'}}
          @selected={{@selected}}
          @options={{this.administrativeBodyOptions.value}}
          @onChange={{@onChange}}
          @triggerId={{@id}}
          as |administrativeBody|
        >
          {{administrativeBody.isTijdsspecialisatieVan.naam}}
          ({{t 'administrative-body-select.period'}}:
          <Year @date={{administrativeBody.bindingStart}} />
          -
          <Year @date={{administrativeBody.bindingEinde}} />)
        </PowerSelect>
      {{/if}}
    </div>
  </template>
}

const year = (date: Date) => date.getFullYear();

type YearSignature = {
  Args: {
    date?: Date;
  };
};
const Year: TOC<YearSignature> = <template>
  {{#if @date}}
    {{year @date~}}
  {{else}}
    {{t 'administrative-body-select.not-applicable'~}}
  {{/if}}
</template>;
