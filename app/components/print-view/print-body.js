import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class PrintBody extends Component {
  @service currentSession;

  get administrativeUnitName() {
    return this.currentSession.group.naam.toLowerCase();
  }
}
