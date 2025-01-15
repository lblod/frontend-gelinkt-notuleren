import Model, { attr, hasMany } from '@ember-data/model';

export default class UserModel extends Model {
  @attr voornaam;
  @attr achternaam;
  @attr rijksregisterNummer;

  @hasMany('account', { inverse: null, async: true })
  account;

  @hasMany('bestuurseenheid', { inverse: null, async: true })
  bestuurseenheden;

  // this is only used for mock login afaik
  async group() {
    return (await this.bestuurseenheden)[0];
  }

  get fullName() {
    return `${this.voornaam} ${this.achternaam}`.trim();
  }
}
