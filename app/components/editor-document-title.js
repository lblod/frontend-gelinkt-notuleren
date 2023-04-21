import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class EditorDocumentTitleComponent extends Component {
  @tracked active = false;
  @tracked error = false;
  @tracked _title;
  @tracked showSaved = false;
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
    this.disabledEdit();
    this.showSaved = true;
    setTimeout(() => (this.showSaved = false), 30000);
    return false;
  }

  @action
  cancel(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      this._title = undefined;
      this.disabledEdit();
    }
  }

  // We check the value of active in these 2 functions to avoid setting it 2 times in the same computation with
  // the cancel event + submit which cause a bug in prod environments.
  @action
  enableEdit() {
    if (this.active) {
      return;
    }
    this.active = true;
  }

  @action
  disabledEdit() {
    if (!this.active) {
      return;
    }
    if (!this.title) {
      this.error = true;
    } else {
      this.active = false;
    }
  }

  @action
  focus(element) {
    element.focus();
  }
}
