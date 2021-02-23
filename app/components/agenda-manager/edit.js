import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class AgendaManagerEditComponent extends Component {
  // @tracked isEditMode = false;

  constructor() {
    super(...arguments);
    // this.isEditMode = this.args.agendapunt.id ? true : false;
  }

  @action
  async toggleGeplandOpenbaar() {
    this.args.agendapunt.geplandOpenbaar = !this.args.agendapunt.geplandOpenbaar;
  }

  get isNew() {
    return this.args.item.isNew;
  }
  @action
  save() {
    this.args.onSave();
    this.args.onClose();
  }
  @action
  cancel() {
    this.args.onCancel();
    this.args.onClose();
  }
}
