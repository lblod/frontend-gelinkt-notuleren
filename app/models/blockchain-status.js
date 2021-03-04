import Model, { attr } from '@ember-data/model';
import { equal } from '@ember/object/computed';

export default Model.extend({
  uri: attr(),
  title: attr(),
  description: attr(),

  isUnpublished: equal('uri', 'http://mu.semte.ch/vocabularies/ext/signing/publication-status/unpublished'),
  isPublishing: equal('uri', 'http://mu.semte.ch/vocabularies/ext/signing/publication-status/publishing'),
  isPublished: equal('uri', 'http://mu.semte.ch/vocabularies/ext/signing/publication-status/published'),
  publicationFailed: equal('uri', 'http://mu.semte.ch/vocabularies/ext/signing/publication-status/publication_failed')
});
