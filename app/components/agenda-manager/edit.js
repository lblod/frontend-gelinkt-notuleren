import Component from '@glimmer/component';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

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
  @task
  *submitTask(item) {
    yield this.args.saveTask.unlinked().perform(item);
    const behandeling = yield item.get('behandeling');
    if (
      item.geplandOpenbaar !== this.oldGeplandOpenbaar &&
      item.geplandOpenbaar !== behandeling.openbaar
    ) {
      behandeling.openbaar = item.geplandOpenbaar;
      yield behandeling.save();
    }
    this.args.onClose();
  }

  @action
  cancel() {
    this.args.onCancel();
  }
  @task
  *deleteTask(item) {
    yield this.args.deleteTask.unlinked().perform(item);
    this.args.onClose();
  }
  @task
  *copyDescription() {
    const behandeling = yield this.args.itemToEdit.behandeling;
    const documentContainer = yield behandeling.documentContainer;
    const currentVersion = yield documentContainer.currentVersion;
    const description = this.documentService.getDescription(currentVersion);
    this.args.itemToEdit.beschrijving = description;
  }
}
