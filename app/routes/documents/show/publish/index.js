import Route from '@ember/routing/route';

export default Route.extend({
  async activate() {
    const container = await this.modelFor('documents.show');
    const publishedAgenda = await this.store.query('versioned-agenda', {filter: {
      "document-container": {":id:": container.id},
      ":has:published-resource": "yes"
    }});
    const hasPublishedAgenda = publishedAgenda.length > 0;
    if (! hasPublishedAgenda) {
      this.transitionTo('documents.show.publish.agenda');
    }
    else {
      this.transitionTo('documents.show.publish.notulen');
    }
  }
});
