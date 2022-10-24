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
    return this._title || this.args.title;
  }


  @action
  setTitle(event) {
    let title = event.target.value;
    this._title = title;

    if (title) {
      this.error = false;
    }
  }

  get enabled() {
    this.args.onChange();
  }

  @action
  submit(event) {
    event.preventDefault();
    console.log(event, this.title);
    this.args.onSubmit?.(this.title);
    this.toggleActive();
    return false;
  }

  @action
  cancel(event) {
    this._title = undefined;
    if (!event.currentTarget.contains(event.relatedTarget)) {
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
