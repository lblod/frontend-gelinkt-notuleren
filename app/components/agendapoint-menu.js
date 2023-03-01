import Component from '@glimmer/component';
import { trackedFunction } from 'ember-resources/util/function';
import { inject as service } from '@ember/service';

export default class AgendapointMenuComponent extends Component {
  @service store;

  attachmentCountData = trackedFunction(this, async () => {
    if (this.args.attachmentCount !== undefined) {
      return this.args.attachmentCount;
    }

    const containerId = this.args.documentContainer.id;
    //this has to be here https://github.com/ember-learn/guides-source/issues/1769
    await Promise.resolve();
    const attachmentResult = await this.store.query('attachment', {
      'filter[document-container][:id:]': containerId,
      'page[size]': 1,
    });

    return attachmentResult.meta.count;
  });

  get attachmentCount() {
    return this.attachmentCountData.value ?? 0;
  }

  revisionCountData = trackedFunction(this, async () => {
    const containerId = this.args.documentContainer.id;
    // We use this little hack to ensure the function is running
    // eslint-disable-next-line no-unused-vars
    if (this.args.editorDocument) {
      const editorDocument = this.args.editorDocument.id;
    }
    //this has to be here https://github.com/ember-learn/guides-source/issues/1769
    await Promise.resolve();
    const revisionCountData = await this.store.query('editor-document', {
      'filter[document-container][:id:]': containerId,
      'page[size]': 1,
    });

    return revisionCountData.meta.count;
  });

  get revisionCount() {
    return this.revisionCountData.value ?? 0;
  }
}
