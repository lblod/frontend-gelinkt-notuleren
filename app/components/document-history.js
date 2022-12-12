import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class DocumentHistoryComponent extends Component {
  @service documentService;
  @tracked revisions;

  @task
  *fetchRevisions() {
    this.revisions = yield this.documentService.fetchRevisions.perform(
      this.args.documentContainerId,
      this.args.currentVersion.id,
      this.args.currentRevisionId
    );
  }
}
