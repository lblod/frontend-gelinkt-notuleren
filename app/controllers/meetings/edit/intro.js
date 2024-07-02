import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { undo } from '@lblod/ember-rdfa-editor/plugins/history';

export default class MeetingsEditIntroController extends Controller {
  @service router;
  @tracked editor;
  @service intl;

  get dirty() {
    // Since we clear the undo history when saving, this works. If we want to maintain undo history
    // on save, we would need to add functionality to the editor to track what is the 'saved' state
    return this.editor?.checkCommand(undo, {
      view: this.editor?.mainEditorView,
    });
  }

  @action
  initEditor(editor) {
    this.editor = editor;
  }

  clearEditor() {
    this.editor = null;
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
    this.clearEditor();
  });
}
