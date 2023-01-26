import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class DocumentHistoryComponent extends Component {
  @service documentService;
  @service router;
  @service currentSession;
  @service intl;
  @tracked revisions;
  @tracked hasMore = true;

  @tracked page = 1;
  pageSize = 20;

  @action
  goBack() {
    history.back();
  }

  @task
  *loadMore() {
    const revisionsToSkip = [this.args.currentVersion.id];
    const newRevisions = yield this.documentService.fetchRevisions.perform(
      this.args.documentContainerId,
      revisionsToSkip,
      this.pageSize,
      this.page
    );
    this.revisions = [...this.revisions, ...newRevisions];
    this.page += 1;
    if (newRevisions.length < this.pageSize) {
      this.hasMore = false;
    }
  }

  @task
  *fetchRevisions() {
    const revisionsToSkip = [this.args.currentVersion.id];
    this.revisions = yield this.documentService.fetchRevisions.perform(
      this.args.documentContainerId,
      revisionsToSkip,
      this.pageSize
    );
    // We add 1 because we are skipping the current version
    if (this.revisions.length + 1 < this.pageSize) {
      this.hasMore = false;
    }
  }
}
