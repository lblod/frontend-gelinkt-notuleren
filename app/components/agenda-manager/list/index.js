import Component from '@glimmer/component';

import { tracked } from "@glimmer/tracking";
export default class AgendaManagerListIndexComponent extends Component {
  @tracked
  createModalActive = false;

  constructor(...args) {
    super(...args);
  }
}
