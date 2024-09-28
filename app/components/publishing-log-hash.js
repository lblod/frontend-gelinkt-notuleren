import Component from '@glimmer/component';
import { trackedFunction } from 'reactiveweb/function';

export default class PublishingLogHashComponent extends Component {
  hash = trackedFunction(this, async () => {
    const log = this.args.log;
    const logResource =
      (await log.signedResource) ?? (await log.publishedResource);
    return logResource.hashValue;
  });
}
