import Component from '@glimmer/component';
import config from '../config/environment';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class VersionInformationOverviewComponent extends Component {
  @tracked
  showModal = false;
  get packages() {
    return config.APP.packages;
  }

  @action
  toggleModal() {
    this.showModal = !this.showModal;
  }
}
