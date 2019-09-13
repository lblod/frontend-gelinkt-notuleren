import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  show: true,
  showCard: computed('hasSnippets', 'show', function(){
    return this.hasSnippets && this.show;
  }),

  importRdfaSnippet: service('import-rdfa-snippet'),
  snippets: computed('importRdfaSnippet.snippets.[]', function(){
    return this.get('importRdfaSnippet.snippets.[]');
  }),
  errors: computed('importRdfaSnippet.errors.[]', function(){
    return this.get('importRdfaSnippet.errors.[]');
  }),
  hasSnippets: computed('snippets.[]', function(){ return this.snippets.length > 0; }),
  hasErrors: computed('errors.[]', function(){ return this.errors.length > 0; }),

  actions: {
    close(){
      this.set('show', false);
    }
  }
});
