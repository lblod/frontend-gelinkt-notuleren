import type { RdfaResourceAttrs } from '@lblod/ember-rdfa-editor/core/rdfa-types';
import { optionMap } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import { MOBILITEIT_INTELLIGENTE_TOEGANG } from '../namespace';
import {
  getOutgoingTriple,
  Resource,
} from '@lblod/ember-rdfa-editor-lblod-plugins/utils/namespace';
import {
  DCT,
  RDF,
  SKOS,
} from '@lblod/ember-rdfa-editor-lblod-plugins/utils/constants';

const getObjectByPredicate = (
  attrs: RdfaResourceAttrs,
  predicate: Resource,
) => {
  return optionMap(
    (triple) => triple.object?.value,
    getOutgoingTriple(attrs, predicate),
  );
};

export const getLogicalOperationType = (attrs: RdfaResourceAttrs) =>
  getObjectByPredicate(attrs, MOBILITEIT_INTELLIGENTE_TOEGANG('operatie'));

export const getPermitOutputType = (attrs: RdfaResourceAttrs) =>
  getObjectByPredicate(
    attrs,
    MOBILITEIT_INTELLIGENTE_TOEGANG('heeftOutputtype'),
  );

export const getDCTType = (attrs: RdfaResourceAttrs) =>
  getObjectByPredicate(attrs, DCT('type'));

export const getRDFType = (attrs: RdfaResourceAttrs) =>
  getObjectByPredicate(attrs, RDF('type'));

export const getLabel = (attrs: RdfaResourceAttrs) =>
  getObjectByPredicate(attrs, SKOS('prefLabel'));
