import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { v4 as uuidv4 } from 'uuid';
import t from 'ember-intl/helpers/t';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuTextarea from '@appuniversum/ember-appuniversum/components/au-textarea';
import BesluitTypeForm from '@lblod/ember-rdfa-editor-lblod-plugins/components/besluit-type-plugin/besluit-type-form';
import RequiredField from '../../components/required-field';
import type { BesluitType } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-type-plugin/utils/fetchBesluitTypes';
import type { BesluitTypeInstance } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-type-plugin/utils/besluit-type-instances';

interface Sig {
  Args: {
    title: string;
    invalidTitle?: boolean;
    updateTitle: (title: string) => void;
    selectedType?: BesluitTypeInstance;
    decisionTypes?: BesluitType[];
    setDecisionType?: (selected: BesluitTypeInstance) => void;
  };
}

export default class MetadataForm extends Component<Sig> {
  updateTitle = (event: Event) => {
    if (event.target && 'value' in event.target) {
      this.args.updateTitle(event.target.value as string);
    }
  };

  <template>
    <form class='au-o-flow au-u-padding'>
      {{#let (uuidv4) as |id|}}
        <AuLabel @error={{@invalidTitle}} for={{id}}>
          {{t 'document-creator.title-field'}}
          <RequiredField />
        </AuLabel>
        <AuTextarea
          @error={{@invalidTitle}}
          @width='block'
          type='text'
          value={{@title}}
          id={{id}}
          {{on 'input' this.updateTitle}}
        />
      {{/let}}
      {{! The types for ember-truth-helpers 'and' don't seem to work with the types here }}
      {{#if @decisionTypes}}
        {{#if @setDecisionType}}
          <BesluitTypeForm
            @types={{@decisionTypes}}
            @selectedType={{@selectedType}}
            @setType={{@setDecisionType}}
          />
        {{/if}}
      {{/if}}
    </form>
  </template>
}
