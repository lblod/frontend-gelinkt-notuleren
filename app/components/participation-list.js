import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from "@ember/object";
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { get } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default class ParticipationListComponent extends Component {
  @tracked popup = false;
  @tracked info;
  @tracked voorzitter;
  @tracked secretaris;

  @service store;

  constructor() {
    super(...arguments);
    this.voorzitter = this.args.voorzitter;
    this.secretaris = this.args.secretaris;
  }
  get aanwezigenBijStart() {
    return this.args.aanwezigenBijStart ?? [];
  }
  get possibleParticipants() {
    return this.args.possibleParticipants ?? [];
  }

  // this is only called after loading has finished
  get hasParticipationInfo() {
    return Boolean(this.aanwezigenBijStart.length > 0 || this.voorzitter || this.secretaris);
  }

  get mandateesPresent(){
    const sorted=this.aanwezigenBijStart.sortBy('isBestuurlijkeAliasVan.achternaam');
    return sorted;
  }
  get mandateesNotPresent() {
    if(this.aanwezigenBijStart.length > 0 && this.possibleParticipants) {
      const aanwezigenUris = this.aanwezigenBijStart.map((mandataris) => mandataris.uri);
      const notPresent = this.possibleParticipants.filter((mandataris) => !aanwezigenUris.includes(mandataris.uri));
      const sorted=notPresent.sortBy('isBestuurlijkeAliasVan.achternaam');
      return sorted;
    }
    return [];
  }

  @action
  togglePopup(e) {
    if(e) {
      e.preventDefault();
    }
    this.popup = !this.popup;
  }
}
