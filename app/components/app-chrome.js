import Component from '@glimmer/component';
import { service } from '@ember/service';
import { DRAFT_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';

export default class AppChromeComponent extends Component {
  @service currentSession;
  @service features;
  @service intl;

  get documentStatus() {
    const status =
      this.args.documentStatus ?? this.args.documentContainer?.get('status');
    return status;
  }

  get isNotAllowedToTrash() {
    return (
      !this.documentStatus || this.documentStatus.get('id') != DRAFT_STATUS_ID
    );
  }
}
