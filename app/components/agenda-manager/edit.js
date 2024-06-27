import Component from '@glimmer/component';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { service } from '@ember/service';

export default class AgendaManagerEditComponent extends Component {
  @service documentService;
  oldGeplandOpenbaar;
  constructor() {
    super(...arguments);
    this.oldGeplandOpenbaar = this.args.itemToEdit.geplandOpenbaar;
  }
  get isNew() {
    return this.args.itemToEdit && this.args.itemToEdit.isNew;
  }

  get isSubmitting() {
    return this.submitTask.isRunning;
  }

  submitTask = task(async (item) => {
    await this.args.saveTask.unlinked().perform(item);
    const behandeling = await item.get('behandeling');
    if (
      item.geplandOpenbaar !== this.oldGeplandOpenbaar &&
      item.geplandOpenbaar !== behandeling.openbaar
    ) {
      behandeling.openbaar = item.geplandOpenbaar;
      await behandeling.save();
    }
    this.args.onClose();
  });

  @action
  cancel() {
    this.args.onCancel();
  }

  deleteTask = task(async (item) => {
    await this.args.deleteTask.unlinked().perform(item);
    this.args.onClose();
  });

  copyDescription = task(async () => {
    const behandeling = await this.args.itemToEdit.behandeling;
    const documentContainer = await behandeling.documentContainer;
    const currentVersion = await documentContainer.currentVersion;
    const description = this.documentService.getDescription(currentVersion);
    this.args.itemToEdit.beschrijving = description;
  });
}
