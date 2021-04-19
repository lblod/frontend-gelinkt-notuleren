import Model, { attr } from '@ember-data/model';

export default class BlockchainStatusModel extends Model {
  @attr uri;
  @attr title;
  @attr description;

  get isUnpublished() {
    return this.uri === 'http://mu.semte.ch/vocabularies/ext/signing/publication-status/unpublished';
  }

  get isPublishing() {
    return this.uri === 'http://mu.semte.ch/vocabularies/ext/signing/publication-status/publishing';
  }

  get isPublished() {
    return this.uri === 'http://mu.semte.ch/vocabularies/ext/signing/publication-status/published';
  }

  get publicationFailed() {
    return this.uri === 'http://mu.semte.ch/vocabularies/ext/signing/publication-status/publication_failed';
  }
}
