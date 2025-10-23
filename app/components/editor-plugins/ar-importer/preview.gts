import type ArDesign from 'frontend-gelinkt-notuleren/models/ar-design';
import AuToolbar from '@appuniversum/ember-appuniversum/components/au-toolbar';
import Component from '@glimmer/component';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import { on } from '@ember/modifier';
import { PlusIcon } from '@appuniversum/ember-appuniversum/components/icons/plus';
import { ArrowLeftIcon } from '@appuniversum/ember-appuniversum/components/icons/arrow-left';
import t from 'ember-intl/helpers/t';

type ArPreviewSignature = {
  Args: {
    arDesign: ArDesign;
    onInsertAR: (arDesign: ArDesign) => unknown;
    onReturnToOverview: () => unknown;
  };
  Element: HTMLDivElement;
};

export default class ArPreview extends Component<ArPreviewSignature> {
  returnToOverview = () => {
    this.args.onReturnToOverview();
  };

  insertAR = () => {
    this.args.onInsertAR(this.args.arDesign);
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
      <div class='ar-importer-preview__content au-u-padding'>
        {{#each @arDesign.measures as |measure|}}
          <p>
            {{measure.templateString}}
          </p>
        {{/each}}
      </div>

    </div>
  </template>
}
