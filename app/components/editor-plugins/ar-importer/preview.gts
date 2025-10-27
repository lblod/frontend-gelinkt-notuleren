import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import { htmlSafe } from '@ember/template';
import t from 'ember-intl/helpers/t';
import { trackedFunction } from 'reactiveweb/function';
import AuToolbar from '@appuniversum/ember-appuniversum/components/au-toolbar';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import { PlusIcon } from '@appuniversum/ember-appuniversum/components/icons/plus';
import { ArrowLeftIcon } from '@appuniversum/ember-appuniversum/components/icons/arrow-left';
import type ArImporterService from 'frontend-gelinkt-notuleren/services/ar-importer';
import type ArDesign from 'frontend-gelinkt-notuleren/models/ar-design';
import type { Task } from 'ember-concurrency';

type ArPreviewSignature = {
  Args: {
    arDesign: ArDesign;
    onInsertAr: Task<void, [ArDesign]>;
    onReturnToOverview: () => unknown;
  };
  Element: HTMLDivElement;
};

export default class ArPreview extends Component<ArPreviewSignature> {
  @service declare arImporter: ArImporterService;

  preview = trackedFunction(this, async () => {
    return this.arImporter.generatePreview(this.args.arDesign);
  });

  returnToOverview = () => {
    this.args.onReturnToOverview();
  };

  insertAR = async () => {
    await this.args.onInsertAr.perform(this.args.arDesign);
  };

  <template>
    <div class='ar-importer-preview' ...attributes>
      <AuToolbar @size='medium' as |Group|>
        <Group>
          <AuButton
            @skin='link'
            @icon={{ArrowLeftIcon}}
            {{on 'click' this.returnToOverview}}
          >{{t 'ar-importer.preview.return-to-overview'}}</AuButton>
        </Group>
        <Group>
          <AuButton @icon={{PlusIcon}} {{on 'click' this.insertAR}}>{{t
              'ar-importer.preview.insert'
            }}</AuButton>
        </Group>
      </AuToolbar>
      {{#if this.preview.value}}
        <div class='ar-importer-preview__content au-u-padding'>
          {{htmlSafe this.preview.value}}
        </div>
      {{/if}}

    </div>
  </template>
}
