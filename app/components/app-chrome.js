import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default class AppChromeComponent extends Component {
  @service currentSession;
  @service features;

  get typeDocument() {
    return this.args.documentType === "meetingMinutes";
  }

  get documentStatus() {
    const status = this.args.documentContainer.get('status');
    return status;
  }

  get isConcept() {
    return this.documentStatus.id == '7186547b61414095aa2a4affefdcca67';
  }
}
