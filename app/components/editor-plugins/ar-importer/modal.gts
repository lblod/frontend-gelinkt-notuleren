import Component from '@glimmer/component';
import ArDesign from 'frontend-gelinkt-notuleren/models/ar-design';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import { tracked } from 'tracked-built-ins';
import ArPreview from './preview';
import ArDesignOverview from './overview';
import t from 'ember-intl/helpers/t';

interface Sig {
  Args: {
    isModalOpen: boolean;
    closeModal: () => void;
  };
}

export default class ArImporterModal extends Component<Sig> {
  @tracked selectedDesign?: ArDesign | null;

  selectDesign = (design: ArDesign) => {
    this.selectedDesign = design;
  };

  returnToOverview = () => {
    this.selectedDesign = null;
  };

  insertAR = (_design: ArDesign) => {};

  <template>
    <AuModal
      @size='large'
      @modalOpen={{@isModalOpen}}
      @closeModal={{@closeModal}}
      @title={{t 'ar-importer.modal.title'}}
      @padding='none'
      as |modal|
    >
      <modal.Body>
        {{#if this.selectedDesign}}
          <ArPreview
            @arDesign={{this.selectedDesign}}
            @onReturnToOverview={{this.returnToOverview}}
            @onInsertAR={{this.insertAR}}
          />
        {{else}}
          <ArDesignOverview
            @onShowPreview={{this.selectDesign}}
            @onInsertAr={{this.insertAR}}
          />
        {{/if}}
      </modal.Body>

    </AuModal>
  </template>
}
