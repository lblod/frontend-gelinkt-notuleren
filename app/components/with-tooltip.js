import Component from '@glimmer/component';
import { Velcro } from 'ember-velcro';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class TooltipComponent extends Component {
  Velcro = Velcro;
  @tracked
  tooltipOpen = false;
  @action
  showTooltip() {
    this.tooltipOpen = true;
  }

  @action hideTooltip() {
    this.tooltipOpen = false;
  }
}
