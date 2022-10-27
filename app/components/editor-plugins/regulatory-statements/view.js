import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ReadOnlyContentSectionComponent extends Component {
  @service store;

  @action
  didInsert() {
    this.retrieveRegulatoryStatement();
  }

  async retrieveRegulatoryStatement() {
    console.log(this.componentController.props.reglementContainerURI);
    const statementContainer = (
      await this.store.query('document-container', {
        'filter[:uri:]': this.componentController.props.reglementContainerURI,
        include: 'current-version',
      })
    ).firstObject;
    const currentVersion = await statementContainer.currentVersion;
    this.componentController.setStateProperty('title', currentVersion.title);
    this.componentController.setStateProperty(
      'updatedOn',
      currentVersion.updatedOn
    );
    this.componentController.setStateProperty(
      'content',
      currentVersion.htmlSafeContent
    );
    this.componentController.setStateProperty(
      'reglementContainerURL',
      `/regulatory-statements/${statementContainer.id}/edit`
    );
  }

  get componentController() {
    return this.args.componentController;
  }

  get editorController() {
    return this.args.editorController;
  }

  get content() {
    return this.componentController.getStateProperty('content');
  }

  get updatedOn() {
    return this.componentController.getStateProperty('updatedOn');
  }

  get reglementContainerURL() {
    return this.componentController.state.reglementContainerURL;
  }

  get reglementContainerURI() {
    return this.componentController.props.reglementContainerURI;
  }

  @action
  detach() {
    this.editorController.executeCommand(
      'remove-component',
      this.componentController.model
    );
  }
}
