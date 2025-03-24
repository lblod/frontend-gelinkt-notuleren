import Model, { attr } from '@ember-data/model';
import { type Type } from '@warp-drive/core-types/symbols';
import { type Option } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';

export default class BestuurseenheidClassificatieCodeModel extends Model {
  declare [Type]: 'bestuurseenheid-classificatie-code';

  @attr label: Option<string>;
  @attr scopeNote: Option<string>;
  @attr uri: Option<string>;

  rdfaBindings = {
    class: 'http://www.w3.org/2004/02/skos/core#Concept',
    label: 'http://www.w3.org/2004/02/skos/core#prefLabel',
    scopeNote: 'http://www.w3.org/2004/02/skos/core#scopeNote',
  };
}
