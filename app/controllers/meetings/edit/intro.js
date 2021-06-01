import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class MeetingsEditIntroController extends Controller {
  @service router;
  @tracked editor;
  @service intl;

  get dirty() {
    return this.model.intro !== this.editor.htmlContent;
  }

  @action
  initEditor(editor) {
    this.editor = editor;
  }

  @action
  closeModal() {
    this.router.transitionTo('meetings.edit', this.model.id);
  }

  @action
  cancel() {
    this.closeModal();
  }
  @action
  async saveAndQuit() {
    await this.saveTextTask.perform();
    this.closeModal();
  }

  @task
  *saveTextTask() {
    const zitting = this.model;
    zitting.intro = this.editor.htmlContent;
    yield zitting.save();
  }

  addExitHandler() {
    this.router.on('routeWillChange', this, this.confirm);
  }

  removeExitHandler() {
    this.router.off('routeWillChange', this, this.confirm);
  }

  confirm(transition) {
    if (transition.isAborted) {
      return;
    }
    if (this.dirty &&
      !window.confirm(
        this.intl.t('meetings.edit.intro.confirmQuitWithoutSaving')
      )) {
      transition.abort();
    }
  }

}
