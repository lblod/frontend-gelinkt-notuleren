import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ReadOnlyContentSectionComponent extends Component {
  @service store;
  @service intl;
  @tracked documentContainer;

  @tracked regulatoryStatementContainer;

  @tracked currentVersion;

  get controller() {
    return this.args.controller;
  }

  @action
  async didInsert() {
    this.regulatoryStatementContainer = (
      await this.store.query('document-container', {
        'filter[:uri:]': this.resource,
        include: 'current-version',
      })
    )[0];

    this.currentVersion =
      await this.regulatoryStatementContainer.currentVersion;
    if (this.node.attrs.title !== this.currentVersion.title) {
      this.args.updateAttribute('title', this.currentVersion.title);
    }
    if (
      this.node.attrs.content.toString() !==
      this.currentVersion.htmlSafeContent.toString()
    ) {
      this.args.updateAttribute('content', this.currentVersion.htmlSafeContent);
    }
  }
  get node() {
    return this.args.node;
  }

  get content() {
    return this.args.node.attrs.content;
  }

  get resource() {
    return this.args.node.attrs['resource'];
  }

  get title() {
    return this.args.node.attrs['title'];
  }

  get updatedOn() {
    return this.currentVersion?.updatedOn;
  }

  get url() {
    return `/regulatory-statements/${this.regulatoryStatementContainer?.id}/edit`;
  }

  @action
  detach() {
    this.controller.withTransaction(
      (tr) => {
        return tr.delete(
          this.args.getPos(),
          this.args.getPos() + this.args.node.nodeSize,
        );
      },
      { view: this.controller.mainEditorView },
    );
  }
}
