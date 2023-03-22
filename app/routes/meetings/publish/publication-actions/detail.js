import Route from '@ember/routing/route';

export default class MeetingsPublishPublicationActionsDetailRoute extends Route {
  async model(params) {
    const log = await this.store.findRecord(
      'publishing_log',
      params.publishing_log_id,
      {
        include: 'signed-resource,published-resource',
      }
    );
    if (log.get('signedResource')) {
      const signedResource = await log.get('signedResource');
      return signedResource.get('content');
    } else {
      const publishedResource = await log.get('publishedResource');
      return await publishedResource.get('content');
    }
  }
}
