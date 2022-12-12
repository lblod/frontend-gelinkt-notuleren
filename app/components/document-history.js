import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class DocumentHistoryComponent extends Component {
  @service store;
  @tracked revisions;

  @task
  *fetchRevisions() {
    const revisions = yield this.store.query('editor-document', {
      'filter[document-container][id]': this.args.documentContainerId,
      sort: '-updated-on',
    });
    const revisionsWithoutCurrentVersion = revisions.filter(
      (revision) =>
        revision.id !== this.args.currentVersion.id &&
        revision.id !== this.args.currentRevisionId
    );
    this.revisions = revisionsWithoutCurrentVersion;
  }
}
