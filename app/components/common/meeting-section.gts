import AuAlert from '@appuniversum/ember-appuniversum/components/au-alert';
import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import type { TOC } from '@ember/component/template-only';

type Signature = {
  Element: HTMLDivElement;
  Args: {
    title: string;
    helpText: string;
  };
  Blocks: {
    default: [];
  };
};

const MeetingSection: TOC<Signature> = <template>
  <div class='au-c-meeting-section' ...attributes>
    <AuHeading
      @level='2'
      @skin='3'
      class='au-c-onboarding-wrapper au-u-margin-bottom-small'
    >
      {{@title}}
    </AuHeading>
    <AuAlert @skin='info' @size='tiny' class='au-u-hide-on-print'>
      {{@helpText}}
    </AuAlert>
    {{yield}}
  </div>
</template>;

export default MeetingSection;
