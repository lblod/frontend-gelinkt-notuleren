import Component from '@glimmer/component';
import { DRAFT_STATUS_ID, PUBLISHED_STATUS_ID, PLANNED_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
export default class AgendaPuntLinkComponent extends Component {
  get editorStatus() {
    const statusId = this.args.documentContainer.status.get('id');
    if (statusId == DRAFT_STATUS_ID) {
      return "draft";
    }
    else if (statusId == PLANNED_STATUS_ID) {
      return "planned";
    }
    else if (statusId == PUBLISHED_STATUS_ID) {
      return "published";
    }
    else {
      return "unknown";
    }
  }
}
