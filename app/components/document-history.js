import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class DocumentHistoryComponent extends Component {
  @service documentService;
  @service router;
  @tracked revisions;

  @action
  goBack() {
    history.back();
  }

  @task
  *fetchRevisions() {
    const revisionsToSkip = [
      this.args.currentVersion.id,
      this.args.currentRevisionId,
    ];
    this.revisions = yield this.documentService.fetchRevisions.perform(
      this.args.documentContainerId,
      revisionsToSkip
    );
  }
}
