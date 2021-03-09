import Component from '@glimmer/component';
import {action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class EditorDocumentTitleComponent extends Component {
  @tracked active = false;
  @tracked _title;
  @tracked error = false;

  constructor() {
    super(...arguments);
    this.active = this.args.editActive;
  }

  get title() {
    if (this._title) {
      return this._title;
    }
    else if (this.args.title) {
      return this.args.title;
    }
    else {
      return "";
    }
  }

  @action
  setTitle(event) {
    this._title = event.target.value;
    if (this.args.onChange) {
      this.args.onChange(this._title);
    }
    if (this._title) {
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
