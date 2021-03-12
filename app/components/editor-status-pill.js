import Component from '@glimmer/component';
import { DRAFT_STATUS_ID, PUBLISHED_STATUS_ID, PLANNED_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';

export default class EditorDocumentStatusPillComponent extends Component {
  get editorStatusClass() {
    const statusId = this.args.status?.get('id');
    if (statusId == DRAFT_STATUS_ID) {
      return "border";
    }
    else if (statusId == PLANNED_STATUS_ID) {
      return "action";
    }
    else if (statusId == PUBLISHED_STATUS_ID) {
      return "success";
    }
    else {
      return "border";
    }
  }
}
