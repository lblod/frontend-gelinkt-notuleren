import Component from '@glimmer/component';
import { action } from "@ember/object";

export default class BesluitDocumentContainerComponent extends Component {
  profile = 'draftDecisionsProfile'
  constructor() {
    super(...arguments);
  }
  @action
  updateTasklists() {
    
  }

}
