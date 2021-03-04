import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ContactFormComponent extends Component {
  @tracked mailto = "gelinktnotuleren@vlaanderen.be";

  @action
  setMailto(value) {
    this.mailto = value;
  }
}
