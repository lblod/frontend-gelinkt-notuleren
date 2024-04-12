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
    if (signedResource?.content) {
      return signedResource.content;
    } else if (signedResource?.file) {
      const fileMeta = await signedResource.file;
      const fileReq = await fetch(fileMeta.downloadLink);
      if (fileReq.ok) {
        return fileReq.text();
      } else {
        return `<div class="au-c-alert au-c-alert--warning"><p>Error fetching file contents: ${fileReq.statusText}</p></div>`;
      }
    } else {
      const publishedResource = await log.publishedResource;
      return publishedResource.content;
    }
  }
}
