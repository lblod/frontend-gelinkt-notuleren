import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class SnippetsNotifier extends Component {
  @service importRdfaSnippet;
  @tracked show = true;

  get showCard() {
    return this.hasSnippets && this.show;
  }

  get snippets() {
    return this.importRdfaSnippet.snippets;
  }

  get errors() {
    return this.importRdfaSnippet.errors;
  }

  get hasSnippets() {
    return this.snippets.length > 0;
  }

  get hasErrors() {
    return this.errors.length > 0;
  }

  @action
  close(){
    this.show=false;
  }
}
