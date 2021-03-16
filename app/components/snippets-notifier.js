import { inject as service } from '@ember/service';
// import { computed } from '@ember/object';
import { tracked } from "@glimmer/tracking";
import Component from '@glimmer/component';
import { action, computed, get } from '@ember/object'

export default class SnippetsNotifier extends Component {

  @service importRdfaSnippet;

  @tracked show=true;

  @computed('hasSnippets', 'show')
  get showCard(){
    return this.hasSnippets && this.show;
  }

  @computed('importRdfaSnippet.snippets.[]')
  get snippets(){
    return get(this.importRdfaSnippet, 'snippets.[]');
  }

  @computed('importRdfaSnippet.errors.[]')
  get errors(){
    return get(this.importRdfaSnippet, 'errors.[]');
  }

  @computed('snippets.[]')
  get hasSnippets(){
    return this.snippets.length > 0;
  }

  @computed('errors.[]')
  get hasErrors(){
    return this.errors.length > 0;
  }

  @action
  close(){
    this.show=false;
  }
}
