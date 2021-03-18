import Component from '@glimmer/component';
import { action } from "@ember/object";

export default class LanguageSelect extends Component{
  options = Object.freeze([
    { id: 'nl', label: 'NL' },
    { id: 'en', label: 'EN' },
  ])
  selected = null

  constructor() {
    super(...arguments);

    if (!this.selected) {
      const defaultOption = this.options.find(o => o.id == 'nl');
      this.selectLanguage(defaultOption);
    }
  }

  @action
  selectLanguage(language) {
    this.set('selected', language);
    document.body.setAttribute('data--language', language.id);
  }
}
