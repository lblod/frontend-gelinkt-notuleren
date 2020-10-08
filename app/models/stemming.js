import Model, { attr, hasMany } from '@ember-data/model';

// :properties `((:aantal-onthouders :number ,(s-prefix "besluit:aantalOnthouders"))
//               (:aantal-tegenstanders :number ,(s-prefix "besluit:aantalTegenstanders"))
//               (:aantal-voorstanders :number ,(s-prefix "besluit:aantalVoorstanders"))
//               (:geheim :boolean ,(s-prefix "besluit:geheim"))
//               (:title :string ,(s-prefix "dct:title"))
//               (:gevolg :language-string ,(s-prefix "besluit:gevolg"))
//               (:onderwerp :language-string ,(s-prefix "besluit:onderwerp")))
// :has-many `((mandataris :via ,(s-prefix "besluit:heeftAanwezige")
//                         :as "aanwezigen")
//             (mandataris :via ,(s-prefix "besluit:heeftOnthouder")
//                         :as "onthouders")
//             (mandataris :via ,(s-prefix "besluit:heeftStemmer")
//                         :as "stemmers")
//             (mandataris :via ,(s-prefix "besluit:heeftTegenstander")
//                         :as "tegenstanders")
//             (mandataris :via ,(s-prefix "besluit:heeftVoorstander")
//                         :as "voorstanders"))
export default class StemmingModel extends Model {

  @attr("number") aantalOnthouders;
  @attr("number") aantalTegenstanders;
  @attr("number") aantalVoorstanders;
  @attr geheim;
  // @attr title;
  @attr("language-string") gevolg;
  @attr("language-string") onderwerp;
  @hasMany("mandataris", { inverse: null }) aanwezigen;
  @hasMany("mandataris", { inverse: null }) onthouders;
  @hasMany("mandataris", { inverse: null }) stemmers;
  @hasMany("mandataris", { inverse: null }) tegenstanders;
  @hasMany("mandataris", { inverse: null }) voorstanders;
}
