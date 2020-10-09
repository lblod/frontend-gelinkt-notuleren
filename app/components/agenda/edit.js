import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class AgendaEditComponent extends Component {
  @action
  async toggleGeplandOpenbaar() {
    this.args.agendapunt.geplandOpenbaar = !this.args.agendapunt
      .geplandOpenbaar;
  }
}
