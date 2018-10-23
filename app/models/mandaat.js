import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import MandaatMixin from '@lblod/ember-rdfa-editor-mandataris-plugin/mixins/mandaat';

export default Model.extend(MandaatMixin, {
  uri: attr(),
  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    class: "http://data.vlaanderen.be/ns/mandaat#Mandaat",
    aantalHouders: "http://data.vlaanderen.be/ns/mandaat#aantalHouders",
    bestuursfunctie: "http://www.w3.org/ns/org#role",
    bevatIn: "http://www.w3.org/ns/org#hasPost"
  }
});
