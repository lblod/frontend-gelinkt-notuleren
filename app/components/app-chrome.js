import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { DRAFT_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';

export default class AppChromeComponent extends Component {
  @service currentSession;
  @service features;

  get documentStatus() {
    const status = this.args.documentContainer?.get('status');
    return status;
  }

  get isNotAllowedToTrash() {
    return (! this.documentStatus) || this.documentStatus.get('id') != DRAFT_STATUS_ID;
  }

  @action
  updateDocumentTitle(title) {
    this.args.editorDocument.title = title;
  }
}
