import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import type { TOC } from '@ember/component/template-only';

type Signature = {
  Element: HTMLDivElement;
  Args: {
    title?: string;
  };
  Blocks: {
    button: [];
    body: [];
  };
};

const MeetingSubSection: TOC<Signature> = <template>
  <div ...attributes>
    <div class='au-u-flex au-u-flex--between au-u-flex--vertical-center'>
      {{#if @title}}
        <AuHeading @level='3' @skin='6'>
          {{@title}}
        </AuHeading>
      {{/if}}
      {{#if (has-block 'button')}}
        {{yield to='button'}}
      {{/if}}
    </div>
    <div class='au-c-meeting-chrome-card'>
      {{yield to='body'}}
    </div>
  </div>
</template>;

export default MeetingSubSection;
