import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class EditorDocumentTitleComponent extends Component {
  @tracked active = false;
  @tracked error = false;
  @tracked _title;
  constructor() {
    super(...arguments);
    this.active = this.args.editActive;
  }

  get title() {
    if (this._title === undefined || this._title === null) {
      return this.args.title;
    } else {
      return this._title;
    }
  }

  get titleModified() {
    if (!this._title) {
      return false;
    }
    return this.args.title !== this._title;
  }

  @action
  setTitle(event) {
    let title = event.target.value;
    this._title = title;

    if (title) {
      this.error = false;
    }
  }

  @action
  submit(event) {
    event.preventDefault();
    this.args.onSubmit?.(this.title);
    this.toggleActive();
    return false;
  }

  @action
  cancel(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      this._title = undefined;
      this.toggleActive();
    }
  }

  @action
  toggleActive() {
    if (this.active && !this.title) {
      this.error = true;
    } else {
      this.active = !this.active;
    }
  }

  @action
  focus(element) {
    element.focus();
  }
}
