import Component from '@glimmer/component';
import { Velcro } from 'ember-velcro';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { hash } from '@ember/helper';
import { on } from '@ember/modifier';
import AuPill from '@appuniversum/ember-appuniversum/components/au-pill';
import type { Placement } from '@floating-ui/dom';

type Signature = {
  Args: {
    tooltip: string;
    placement?: Placement;
  };
  Blocks: {
    default: [];
  };
};
export default class WithTooltip extends Component<Signature> {
  @tracked
  tooltipOpen = false;

  get placement(): Placement {
    return this.args.placement ?? 'top';
  }

  @action
  showTooltip() {
    this.tooltipOpen = true;
  }

  @action hideTooltip() {
    this.tooltipOpen = false;
  }

  <template>
    <Velcro
      @placement={{this.placement}}
      @offsetOptions={{hash mainAxis=10}}
      as |velcro|
    >
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
        <AuPill class='gn-tooltip' role='tooltip' {{velcro.loop}}>
          {{@tooltip}}
        </AuPill>
      {{/if}}
    </Velcro>
  </template>
}
