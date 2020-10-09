import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";

export default class BesluitDocumentContainerComponent extends Component {
  profile = 'newFlowProfile'
  constructor() {
    super(...arguments);
  }
  @action
  updateTasklists() {
    
  }

}
