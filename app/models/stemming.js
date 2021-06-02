import Model, { attr, hasMany } from '@ember-data/model';

export default class StemmingModel extends Model {
  @attr("number") index;
  @attr("number") aantalOnthouders;
  @attr("number") aantalTegenstanders;
  @attr("number") aantalVoorstanders;
  @attr geheim;
  // @attr title;
  @attr("string") gevolg;
  @attr("string") onderwerp;
  /** @type {import("ember-data").DS.RecordArray} */
  @hasMany("mandataris", { inverse: null }) aanwezigen;
  @hasMany("mandataris", { inverse: null }) onthouders;
  @hasMany("mandataris", { inverse: null }) stemmers;
  @hasMany("mandataris", { inverse: null }) tegenstanders;
  @hasMany("mandataris", { inverse: null }) voorstanders;
}
