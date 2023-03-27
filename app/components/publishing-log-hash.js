import Component from '@glimmer/component';
import { trackedFunction } from 'ember-resources/util/function';

export default class PublishingLogHashComponent extends Component {
  hash = trackedFunction(this, async () => {
    const log = this.args.log;
    const logResource =
      (await log.signedResource) ?? (await log.publishedResource);
    return logResource.hashValue;
  });
}
