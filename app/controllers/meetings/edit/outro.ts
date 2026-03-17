import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type IntlService from 'ember-intl/services/intl';
import type { SayController } from '@lblod/ember-rdfa-editor';
import type MeetingsEditRoute from 'frontend-gelinkt-notuleren/routes/meetings/edit';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';

export default class MeetingsEditOutroController extends Controller {
  declare model: ModelFrom<MeetingsEditRoute>;
  @service declare router: RouterService;
  @service declare intl: IntlService;
  @tracked editor?: SayController;

  get dirty() {
    return this.editor?.isDirty;
  }

  @action
  initEditor(editor: SayController) {
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
    if (this.editor) {
      const zitting = this.model;
      zitting.outro = this.editor?.htmlContent;
      await zitting.save();
      this.editor.markClean();
    }
  });
}
