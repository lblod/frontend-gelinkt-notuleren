import type { TOC } from '@ember/component/template-only';
import { fn } from '@ember/helper';
import { hash } from '@ember/helper';
import { on } from '@ember/modifier';
import type { WithBoundArgs } from '@glint/template';
import t from 'ember-intl/helpers/t';
import plainDate from 'frontend-gelinkt-notuleren/helpers/plain-date';
import MandatarisModel from 'frontend-gelinkt-notuleren/models/mandataris';

type ToggleParticipant = (
  mandataris: MandatarisModel,
  selected: boolean,
) => unknown;

type MandatarissenTableSig = {
  Args: {
    toggleParticipant: ToggleParticipant;
  };
  Blocks: {
    default: [{ Row: WithBoundArgs<typeof MandatarisRow, 'toggle'> }];
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
              {{t 'participation-list-modal-table.actie-label'}}
            </div>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      {{yield (hash Row=(component MandatarisRow toggle=@toggleParticipant))}}
    </tbody>
  </table>
</template>;

export default MandatarissenTable;

type MandatarisRowSig = {
  Args: {
    mandataris: MandatarisModel;
    selected: boolean;
    toggle: ToggleParticipant;
    disabled?: boolean;
  };
};

const MandatarisRow: TOC<MandatarisRowSig> = <template>
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
      <label class='checkbox checkbox--block'>
        <input
          class='checkbox__toggle'
          type='checkbox'
          checked={{@selected}}
          {{on 'input' (fn @toggle @mandataris @selected)}}
          disabled={{@disabled}}
        />
        <span></span>
        <strong>{{t 'participation-list-modal-table.checkbox-label'}}</strong>
      </label>
    </td>
  </tr>
</template>;
