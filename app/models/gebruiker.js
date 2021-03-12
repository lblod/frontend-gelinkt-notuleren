import Model, { attr, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';

export default class UserModel extends Model {
  @attr voornaam;
  @attr achternaam;
  @attr rijksregisterNummer;

  @hasMany('account', { inverse: null })
  account;

  @hasMany('bestuurseenheden', { inverse: null })
  bestuurseenheden;

  // this is only used for mock login afaik
  get group() {
    return this.bestuurseenheden.firstObject;
  }

  get fullName() {
    return `${this.voornaam} ${this.achternaam}`.trim();
  }
}
