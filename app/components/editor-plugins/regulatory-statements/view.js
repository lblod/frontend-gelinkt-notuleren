import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ReadOnlyContentSectionComponent extends Component {
  @service store;
  @tracked documentContainer;

  @action
  didInsert() {
    this.retrieveRegulatoryStatement();
  }

  async retrieveRegulatoryStatement() {
    const regulatoryStatementContainer = (
      await this.store.query('document-container', {
        'filter[:uri:]': this.uri,
        include: 'current-version',
      })
    ).firstObject;
    this.documentContainer = regulatoryStatementContainer;
    const currentVersion = await regulatoryStatementContainer.currentVersion;
    this.componentController.setProperty('title', currentVersion.title);
    this.componentController.setProperty('updatedOn', currentVersion.updatedOn);
    this.componentController.setProperty(
      'content',
      currentVersion.htmlSafeContent
    );
  }

  get componentController() {
    return this.args.componentController;
  }

  get editorController() {
    return this.args.editorController;
  }

  get content() {
    return this.componentController.getProperty('content');
  }

  get updatedOn() {
    return this.componentController.getProperty('updatedOn');
  }

  get uri() {
    return this.componentController.getProperty('uri');
  }

  @action
  detach() {
    this.editorController.executeCommand(
      'remove-component',
      this.componentController.model
    );
  }
}
