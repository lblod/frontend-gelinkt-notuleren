import Component from '@glimmer/component';
import {action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class EditorDocumentTitleComponent extends Component {
  @tracked _active = false;
  @tracked _title;

  get active() {
    return this._active || (!this._title && ! this.args.title);
  }

  get title() {
    if (this._title) {
      return this._title;
    }
    else if (this.args.title) {
      return this.args.title;
    }
    else {
      return "Naamloos document";
    }
  }

  @action
  setTitle(event) {
    this._title = event.target.value;
    if (this.args.onChange) {
      this.args.onChange(this._title);
    }
  }

  @action
  toggleActive() {
    this._active = ! this._active;
    console.log(this._active);
  }
}
