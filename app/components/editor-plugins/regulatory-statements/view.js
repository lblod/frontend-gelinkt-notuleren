import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ReadOnlyContentSectionComponent extends Component {
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
