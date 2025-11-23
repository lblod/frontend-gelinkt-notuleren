import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from 'tracked-built-ins';
import { task } from 'ember-concurrency';
import type { SayController } from '@lblod/ember-rdfa-editor';
import ArDesign from 'frontend-gelinkt-notuleren/models/ar-design';
import type ArImporterService from 'frontend-gelinkt-notuleren/services/ar-importer';
import ArPreview from './preview';
import ArDesignOverview from './overview';

type Sig = {
  Args: {
    controller: SayController;
    onInsert?: () => void;
  };
};

export default class ArWidgetContents extends Component<Sig> {
  @service declare arImporter: ArImporterService;

  @tracked selectedDesign?: ArDesign | null;

  selectDesign = (design: ArDesign) => {
    this.selectedDesign = design;
  };

  returnToOverview = () => {
    this.selectedDesign = null;
  };

  insertAr = task(async (design: ArDesign) => {
    const isSuccess = await this.arImporter.insertAr(
      this.args.controller,
      design,
    );
    if (isSuccess) {
      this.args.onInsert?.();
    }
  });

  <template>
    {{#if this.selectedDesign}}
      <ArPreview
        @arDesign={{this.selectedDesign}}
        @onReturnToOverview={{this.returnToOverview}}
        @onInsertAr={{this.insertAr.perform}}
      />
    {{else}}
      <ArDesignOverview
        @onShowPreview={{this.selectDesign}}
        @onInsertAr={{this.insertAr.perform}}
      />
    {{/if}}
  </template>
}
