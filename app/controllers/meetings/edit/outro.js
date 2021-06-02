import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class MeetingsEditOutroController extends Controller {
  @service router;
  @tracked editor;
  @service intl;

  get dirty() {
    return this.model.outro !== this.editor.htmlContent;
  }

  @action
  initEditor(editor) {
    this.editor = editor;
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
        this.intl.t('meetings.edit.outro.confirmQuitWithoutSaving')
      )) {
      transition.abort();
    }
  }

  @action
  closeModal() {
    this.router.transitionTo('meetings.edit', this.model.id);
  }

  @action
  async saveAndQuit() {
    await this.saveTextTask.perform();
    this.closeModal();
  }

  @task
  *saveTextTask() {
    const zitting = this.model;
    zitting.outro = this.editor.htmlContent;
    yield zitting.save();
  }
}
