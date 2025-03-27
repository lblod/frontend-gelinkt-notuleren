import Component from '@glimmer/component';
import { Velcro } from 'ember-velcro';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { hash } from '@ember/helper';
import { on } from '@ember/modifier';
import AuPill from '@appuniversum/ember-appuniversum/components/au-pill';

type Signature = {
  Args: {
    tooltip: string;
  };
  Blocks: {
    default: [];
  };
};
export default class TooltipComponent extends Component<Signature> {
  @tracked
  tooltipOpen = false;

  @action
  showTooltip() {
    this.tooltipOpen = true;
  }

  @action hideTooltip() {
    this.tooltipOpen = false;
  }

  <template>
    <Velcro @placement='top' @offsetOptions={{hash mainAxis=10}} as |velcro|>
      <div
        {{on 'mouseenter' this.showTooltip}}
        {{on 'mouseleave' this.hideTooltip}}
        {{on 'focus' this.showTooltip}}
        {{on 'blur' this.hideTooltip}}
        {{velcro.hook}}
      >
        {{yield}}
      </div>
      {{#if this.tooltipOpen}}
        <AuPill role='tooltip' {{velcro.loop}}>
          {{@tooltip}}
        </AuPill>
      {{/if}}
    </Velcro>
  </template>
}
