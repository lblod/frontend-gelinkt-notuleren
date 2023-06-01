import { service } from '@ember/service';
import Component from '@glimmer/component';

export default class SnippetsNotifier extends Component {
  @service importRdfaSnippet;

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
}
