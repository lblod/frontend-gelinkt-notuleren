import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { getResourceContent } from 'frontend-gelinkt-notuleren/utils/get-resource-content';

function onError(statusText) {
  return `<div class="au-c-alert au-c-alert--warning"><p>Error fetching file contents: ${statusText}</p></div>`;
}

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
      return getResourceContent(signedResource, onError);
    } else {
      const publishedResource = await log.publishedResource;
      return getResourceContent(publishedResource, onError);
    }
  }
}
