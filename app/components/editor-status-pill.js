import { computed } from '@ember/object';
import Component from '@glimmer/component';

const CONCEPT_STATUS = "a1974d071e6a47b69b85313ebdcef9f7";
const GEAGENDEERD_STATUS = "7186547b61414095aa2a4affefdcca67";
const GEPUBLICEERD_STATUS = "ef8e4e331c31430bbdefcdb2bdfbcc06";
export default class EditorDocumentStatusPillComponent extends Component {
  get editorStatusClass() {
    const statusId = this.args.status?.get('id');
    if (statusId == CONCEPT_STATUS) {
      return "border";
    }
    else if ( statusId == GEAGENDEERD_STATUS) {
      return "action";
    }
    else if ( statusId == GEPUBLICEERD_STATUS) {
      return "success";
    }
    else {
      return "border";
    }
  }
}
