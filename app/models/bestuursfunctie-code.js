import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import CodeMixin from '@lblod/ember-rdfa-editor-mandataris-plugin/mixins/bestuursfunctie-code';

export default Model.extend(CodeMixin, {
  uri: attr(),
  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    class: "http://www.w3.org/2004/02/skos/core#Concept",
    label: "http://www.w3.org/2004/02/skos/core#prefLabel"
   }
});
