import type { TOC } from '@ember/component/template-only';
import { fn } from '@ember/helper';
import { hash } from '@ember/helper';
import { on } from '@ember/modifier';
import type { WithBoundArgs } from '@glint/template';
import t from 'ember-intl/helpers/t';
import plainDate from 'frontend-gelinkt-notuleren/helpers/plain-date';
import MandatarisModel from 'frontend-gelinkt-notuleren/models/mandataris';
import PowerSelect from 'ember-power-select/components/power-select';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { get } from '@ember/helper';
import AuPill from '@appuniversum/ember-appuniversum/components/au-pill';
import type IntlService from 'ember-intl/services/intl';
import { service } from '@ember/service';

type UpdateParticipationStatus = (
  mandataris: MandatarisModel,
  status: ParticipationStatus,
) => unknown;

type MandatarissenTableSig = {
  Args: {
    advancedMode?: boolean;
    updateParticipationStatus: UpdateParticipationStatus;
  };
  Blocks: {
    default: [
      {
        Row: WithBoundArgs<
          typeof MandatarisRow,
          'updateStatus' | 'advancedMode'
        >;
      },
    ];
  };
};
const MandatarissenTable: TOC<MandatarissenTableSig> = <template>
  <table class='au-c-table-border'>
    <thead>
      <tr>
        <th>{{t 'participation-list-modal-table.naam-label'}}</th>
        <th>{{t 'participation-list-modal-table.functie-label'}}</th>
        <th>{{t 'participation-list-modal-table.geboortedatum-label'}}</th>
        <th>{{t 'participation-list-modal-table.bestuursperiode-label'}}</th>
        <th>
          <div class='grid'>
            <div class='col--4-12'>
              {{t 'participation-list-modal-table.status-label'}}
            </div>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      {{yield
        (hash
          Row=(component
            MandatarisRow
            updateStatus=@updateParticipationStatus
            advancedMode=@advancedMode
          )
        )
      }}
    </tbody>
  </table>
</template>;

export enum ParticipationStatus {
  Attending,
  Absent,
  NoMandate,
}

export default MandatarissenTable;

type MandatarisRowSig = {
  Args: {
    mandataris: MandatarisModel;
    status: ParticipationStatus;
    updateStatus: UpdateParticipationStatus;
    disabled?: boolean;
    advancedMode?: boolean;
  };
};

class MandatarisRow extends Component<MandatarisRowSig> {
  @service declare intl: IntlService;

  get participationStatusOptions() {
    return [
      ParticipationStatus.Attending,
      ParticipationStatus.Absent,
      ParticipationStatus.NoMandate,
    ];
  }

  get participationStatusIntl(): Record<ParticipationStatus, string> {
    return {
      [ParticipationStatus.Attending]: this.intl.t(
        'participation-list-modal-table.status-options.attending',
      ),
      [ParticipationStatus.Absent]: this.intl.t(
        'participation-list-modal-table.status-options.absent',
      ),
      [ParticipationStatus.NoMandate]: this.intl.t(
        'participation-list-modal-table.status-options.no-mandate',
      ),
    };
  }

  get checked() {
    return this.args.status === ParticipationStatus.Attending;
  }

  @action
  onCheck(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.args.updateStatus(
      this.args.mandataris,
      checked ? ParticipationStatus.Absent : ParticipationStatus.Attending,
    );
  }

  get hasNoMandate() {
    return this.args.status === ParticipationStatus.NoMandate;
  }
  <template>
    <tr>
      {{! @glint-expect-error we should properly await this }}
      <td>{{@mandataris.isBestuurlijkeAliasVan.gebruikteVoornaam}}
        {{! @glint-expect-error we should properly await this }}
        {{@mandataris.isBestuurlijkeAliasVan.achternaam}}</td>
      {{! @glint-expect-error we should properly await this }}
      <td>{{@mandataris.bekleedt.bestuursfunctie.label}}</td>
      {{! @glint-expect-error we should properly await this }}
      <td>{{plainDate @mandataris.isBestuurlijkeAliasVan.geboorte.datum}}</td>
      <td>{{plainDate @mandataris.start}} - {{plainDate @mandataris.einde}}</td>
      <td>
        {{#if @advancedMode}}
          <PowerSelect
            @options={{this.participationStatusOptions}}
            @selected={{@status}}
            @disabled={{@disabled}}
            @onChange={{fn @updateStatus @mandataris}}
            @placeholder='status'
            as |option|
          >
            {{get this.participationStatusIntl option}}
          </PowerSelect>
        {{else}}
          {{#if this.hasNoMandate}}
            <AuPill @skin='border'>{{t
                'participation-list-modal-table.status-options.no-mandate'
              }}</AuPill>
          {{else}}
            <label class='checkbox checkbox--block'>
              <input
                class='checkbox__toggle'
                type='checkbox'
                checked={{this.checked}}
                {{on 'input' this.onCheck}}
                disabled={{@disabled}}
              />
              <span></span>
              <strong>{{t
                  'participation-list-modal-table.checkbox-label'
                }}</strong>
            </label>
          {{/if}}
        {{/if}}
      </td>
    </tr>
  </template>
}
