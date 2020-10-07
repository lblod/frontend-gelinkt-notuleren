import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";

export default class BesluitDocumentContainerComponent extends Component {
  @service store;
  profile = 'default'
  constructor() {
    super(...arguments);
    this.document = this.store.createRecord('editor-document');
  }
  @action
  handleRdfaEditorInit() {

  }
  @action
  updateTasklists() {
    
  }

}
