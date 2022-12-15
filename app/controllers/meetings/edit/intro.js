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
    this.router.transitionTo('meetings.edit');
  }

  @action
  async saveAndQuit() {
    await this.saveTextTask.perform();
    this.closeModal();
  }

  saveTextTask = task(async () => {
    const zitting = this.model;
    zitting.intro = this.editor.htmlContent;
    await zitting.save();
  });
}
