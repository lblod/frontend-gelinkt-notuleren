import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { v4 as uuidv4 } from 'uuid';
import t from 'ember-intl/helpers/t';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuTextarea from '@appuniversum/ember-appuniversum/components/au-textarea';
import RequiredField from '../../components/required-field';

interface Sig {
  Args: {
    title: string;
    invalidTitle?: boolean;
    updateTitle: (title: string) => void;
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
      <div>
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
      </div>
    </form>
  </template>
}
