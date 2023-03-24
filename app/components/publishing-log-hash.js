import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class PublishingLogHashComponent extends Component {
  @tracked hash;

  @task
  *loadData() {
    const log = this.args.log;
    const logResource =
      (yield log.signedResource) ?? (yield log.publishedResource);
    this.hash = logResource.hashValue;
  }
}
