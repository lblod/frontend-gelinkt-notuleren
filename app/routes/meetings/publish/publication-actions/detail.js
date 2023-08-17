import Route from '@ember/routing/route';
import { service } from '@ember/service';
export default class MeetingsPublishPublicationActionsDetailRoute extends Route {
  @service store;

  async model(params) {
    const log = await this.store.findRecord(
      'publishing_log',
      params.publishing_log_id,
      {
        include: 'signed-resource,published-resource',
      },
    );
    const signedResource = await log.signedResource;
    if (signedResource) {
      return signedResource.content;
    } else {
      const publishedResource = await log.publishedResource;
      return publishedResource.content;
    }
  }
}
