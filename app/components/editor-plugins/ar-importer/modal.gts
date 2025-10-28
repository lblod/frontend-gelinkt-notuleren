import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from 'tracked-built-ins';
import t from 'ember-intl/helpers/t';
import { task } from 'ember-concurrency';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import type { SayController } from '@lblod/ember-rdfa-editor';
import ArDesign from 'frontend-gelinkt-notuleren/models/ar-design';
import type ArImporterService from 'frontend-gelinkt-notuleren/services/ar-importer';
import ArPreview from './preview';
import ArDesignOverview from './overview';

type Sig = {
  Args: {
    controller: SayController;
    isModalOpen: boolean;
    closeModal: () => void;
  };
};

export default class ArImporterModal extends Component<Sig> {
  @service declare arImporter: ArImporterService;

  @tracked selectedDesign?: ArDesign | null;

  selectDesign = (design: ArDesign) => {
    this.selectedDesign = design;
  };

  returnToOverview = () => {
    this.selectedDesign = null;
  };

  insertAr = task(async (design: ArDesign) => {
    await this.arImporter.insertAr(this.args.controller, design);
    this.args.closeModal();
  });

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
            @onInsertAr={{this.insertAr}}
          />
        {{else}}
          <ArDesignOverview
            @onShowPreview={{this.selectDesign}}
            @onInsertAr={{this.insertAr}}
          />
        {{/if}}
      </modal.Body>

    </AuModal>
  </template>
}
