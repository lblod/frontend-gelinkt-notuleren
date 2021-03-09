import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

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

  get isNotAllowedToTrash() {
    return this.documentStatus.get('id') != 'a1974d071e6a47b69b85313ebdcef9f7';
  }

  @action
  updateDocumentTitle(title) {
    this.args.editorDocument.title = title;
  }
}
