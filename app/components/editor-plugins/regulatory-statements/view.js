import Component from '@glimmer/component';
import { action } from '@ember/object';
import { findRecord } from 'ember-data-resources';
export default class ReadOnlyContentSectionComponent extends Component {
  regulatoryStatement = findRecord(
    this,
    'document-container',
    () => this.reglementContainerId
  );

  get componentController() {
    return this.args.componentController;
  }

  get editorController() {
    return this.args.editorController;
  }

  get content() {
    return 'content';
  }

  get reglementContainerId() {
    console.log(this.componentController.props.reglementContainerId);
    return this.componentController.props.reglementContainerId;
  }

  @action
  detach() {
    this.editorController.executeCommand(
      'remove-component',
      this.componentController.model
    );
  }
}
