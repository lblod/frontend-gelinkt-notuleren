import Component from '@glimmer/component';
import {action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class EditorDocumentTitleComponent extends Component {
  @tracked active = false;
  @tracked error = false;

  constructor() {
    super(...arguments);
    this.active = this.args.editActive;
  }

  get title() {
    return this.args.title || '';
  }

  @action
  setTitle(event) {
    let title = event.target.value;

    this.args.onChange?.(title);

    if (title) {
      this.error = false;
    }
  }

  @action
  toggleActive() {
    if (this.active && ! this.title) {
      this.error = true;
    }
    else {
      this.active = ! this.active;
    }
  }
}
