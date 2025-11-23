import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import { htmlSafe } from '@ember/template';
import { fn } from '@ember/helper';
import t from 'ember-intl/helpers/t';
import { trackedFunction } from 'reactiveweb/function';
import AuToolbar from '@appuniversum/ember-appuniversum/components/au-toolbar';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import { PlusIcon } from '@appuniversum/ember-appuniversum/components/icons/plus';
import { ArrowLeftIcon } from '@appuniversum/ember-appuniversum/components/icons/arrow-left';
import AuLoader from '@appuniversum/ember-appuniversum/components/au-loader';
import type ArImporterService from 'frontend-gelinkt-notuleren/services/ar-importer';
import type ArDesign from 'frontend-gelinkt-notuleren/models/ar-design';
import AuAlert from '@appuniversum/ember-appuniversum/components/au-alert';

type ArPreviewSignature = {
  Args: {
    arDesign: ArDesign;
    onInsertAr: (arDesign: ArDesign) => void;
    onReturnToOverview: () => unknown;
  };
  Element: HTMLDivElement;
};

export default class ArPreview extends Component<ArPreviewSignature> {
  @service declare arImporter: ArImporterService;

  preview = trackedFunction(this, async () => {
    try {
      const preview = await this.arImporter.generatePreview(this.args.arDesign);
      return preview;
    } catch (e) {
      console.error(e);
      throw e;
    }
  });

  returnToOverview = () => {
    this.args.onReturnToOverview();
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
          <AuButton
            @icon={{PlusIcon}}
            {{on 'click' (fn @onInsertAr @arDesign)}}
          >{{t 'ar-importer.preview.insert'}}</AuButton>
        </Group>
      </AuToolbar>
      {{#if this.preview.isLoading}}
        <AuLoader @hideMessage={{true}}>
          {{t 'application.loading'}}
        </AuLoader>
      {{/if}}
      {{#if this.preview.isError}}
        <AuAlert @icon='alert-triangle' @skin='error'>
          {{t 'ar-importer.message.error-processing-design'}}
        </AuAlert>
      {{/if}}
      {{#if this.preview.value}}
        <div class='ar-importer-preview__content au-o-layout'>
          {{htmlSafe this.preview.value}}
        </div>
      {{/if}}

    </div>
  </template>
}
