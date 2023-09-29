import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { isBlank } from '../utils/strings';
import { restartableTask, timeout } from 'ember-concurrency';

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

  get isTitleModified() {
    if (!this._title) {
      return false;
    }
    return this.args.title !== this._title;
  }

  get isInvalidTitle() {
    // do not allow empty titles
    return isBlank(this.title);
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
    if (this.isInvalidTitle || !this.isTitleModified) {
      this.cancel();
      return;
    }
    this.args.onSubmit?.(this.title);
    this.disableEdit();
    this.showIsSavedTask.perform();
    return false;
  }

  showIsSavedTask = restartableTask(async () => {
    await timeout(3000);
  });

  @action
  cancel() {
    this._title = undefined;
    this.disableEdit();
  }

  @action
  cancelOnEscape(keyEvent) {
    if (keyEvent.key === 'Escape') {
      this.cancel();
    }
  }

  // We check the value of active in these 2 functions to avoid setting it 2 times in the same computation with
  // the cancel event + submit which cause a bug in prod environments.
  @action
  enableEdit() {
    this.showIsSavedTask.cancelAll();
    if (this.active) {
      return;
    }
    this.active = true;
  }

  @action
  disableEdit() {
    if (!this.active) {
      return;
    }
    this.active = false;
  }

  @action
  focus(element) {
    element.focus();
  }
}
