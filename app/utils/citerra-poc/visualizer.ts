import {
  getNodeByRdfaId,
  type DisplayGenerator,
  type RdfaVisualizerConfig,
} from '@lblod/ember-rdfa-editor/plugins/rdfa-info';
import type { OutgoingTriple } from '@lblod/ember-rdfa-editor/core/rdfa-processor';
import type { PNode } from '@lblod/ember-rdfa-editor';
import { isSome } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import {
  DCT,
  EXT,
  PROV,
  RDF,
  SAY,
  SKOS,
} from '@lblod/ember-rdfa-editor-lblod-plugins/utils/constants';
import {
  CPSV,
  M8G,
  MOBILITEIT_INTELLIGENTE_TOEGANG,
  PUBLICSERVICE,
} from '../namespace';
import { type RdfaResourceAttrs } from '@lblod/ember-rdfa-editor/core/rdfa-types';
import {
  getDCTType,
  getLabel,
  getLogicalOperationType,
  getRDFType,
} from './utils';
import type { Literal, NamedNode } from '@rdfjs/types';
import {
  OPERATION_TYPES,
  PUBLIEKE_DIENSTVERLENING_OUTPUTCODE,
  VOORWAARDE_EXPECTED_VALUES,
  VOORWAARDE_TYPES,
} from './codelists';
import type { LiteralNodeTerm } from '@lblod/ember-rdfa-editor/core/say-data-factory';

const HIDDEN_PREDICATES = [
  RDF('type'),
  SKOS('prefLabel'),
  PROV('value'),
  SAY('allowedSnippetList'),
  DCT('type'),
  MOBILITEIT_INTELLIGENTE_TOEGANG('operatie'),
  M8G('hasEvidenceTypeList'),
];

const humanReadablePredicate: DisplayGenerator<OutgoingTriple> = (triple) => {
  if (
    HIDDEN_PREDICATES.some((predicate) =>
      predicate.matches(triple.predicate),
    ) ||
    triple.object.termType === 'ContentLiteral'
  ) {
    return [{ hidden: true }];
  }
  switch (true) {
    case PUBLICSERVICE('hasRequirement').matches(triple.predicate):
    case M8G('hasRequirement').matches(triple.predicate):
      return {
        meta: { title: triple.predicate },
        elements: [{ strong: 'Heeft voorwaarde' }],
      };
    case MOBILITEIT_INTELLIGENTE_TOEGANG('heeftOutputtype').matches(
      triple.predicate,
    ):
      return {
        meta: { title: triple.predicate },
        elements: [{ strong: 'Type' }],
      };
    case EXT('expectedValue').matches(triple.predicate):
      return {
        meta: { title: triple.predicate },
        elements: [{ strong: 'Verwachte/toegelaten waarde' }],
      };
    default:
      return {
        meta: { title: triple.predicate },
        elements: [
          { strong: 'predicate:' },
          triple.predicate.split(/[/#]/).at(-1) ?? triple.predicate,
        ],
      };
  }
};

// const HIDDEN_RESOURCE_TYPES = [EXT('Snippet'), EXT('SnippetPlaceholder')];

const humanReadableSubject: DisplayGenerator<PNode> = (node) => {
  const attrs = node.attrs as RdfaResourceAttrs;
  const rdfType = getRDFType(attrs);
  if (!rdfType) {
    return [{ strong: attrs.subject }];
  }
  // if (HIDDEN_RESOURCE_TYPES.some((hiddenType) => hiddenType.matches(rdfType))) {
  //   return [{ hidden: true }];
  // }
  const label = getLabel(attrs);
  switch (true) {
    case CPSV('PublicService').matches(rdfType):
      return {
        meta: { title: attrs.subject },
        elements: [{ strong: 'Vergunning' }],
      };
    case MOBILITEIT_INTELLIGENTE_TOEGANG('Voorwaardecollectie').matches(
      rdfType,
    ): {
      const operationType = getLogicalOperationType(attrs);
      const operationTypeLabel =
        operationType && OPERATION_TYPES[operationType];
      const label = operationTypeLabel
        ? `Voorwaarcollectie (${operationTypeLabel})`
        : 'Voorwaarcollectie';
      return {
        meta: { title: attrs.subject },
        elements: [{ strong: label }],
      };
    }
    case M8G('Requirement').matches(rdfType): {
      const voorwaardeTypeURI = getDCTType(attrs);
      const voorwaardeTypeLabel =
        voorwaardeTypeURI && VOORWAARDE_TYPES[voorwaardeTypeURI];
      return {
        meta: { title: attrs.subject },
        elements: [{ strong: voorwaardeTypeLabel ?? 'Voorwaarde' }],
      };
    }
    case isSome(label):
      return {
        meta: { title: attrs.subject },
        elements: [{ strong: label }],
      };
    default:
      return {
        meta: { title: attrs.subject },
        elements: [{ strong: `${rdfType.split(/[/#]/).at(-1)}` }],
      };
  }
};

const humanReadableObject_NamedNode: DisplayGenerator<OutgoingTriple> = (
  triple,
) => {
  const predicate = triple.predicate;
  const object = triple.object as NamedNode;
  switch (true) {
    case MOBILITEIT_INTELLIGENTE_TOEGANG('heeftOutputtype').matches(predicate):
      return {
        meta: { title: object.value },
        elements: [
          PUBLIEKE_DIENSTVERLENING_OUTPUTCODE[object.value] ?? object.value,
        ],
      };
    case EXT('expectedValue').matches(predicate):
      return {
        meta: { title: object.value },
        elements: [VOORWAARDE_EXPECTED_VALUES[object.value] ?? object.value],
      };
    default:
      return {
        meta: { title: object.value },
        elements: [object.value],
      };
  }
};

const humanReadableObject_Literal: DisplayGenerator<OutgoingTriple> = (
  triple,
) => {
  const object = triple.object as Literal;
  return [object.value];
};

const humanReadableObject_LiteralNode: DisplayGenerator<OutgoingTriple> = (
  triple,
  { controller },
) => {
  const object = triple.object as LiteralNodeTerm;
  const node = getNodeByRdfaId(controller.mainEditorState, object.value);
  const label = node
    ? ((node.value.attrs['content'] as string | undefined) ??
      node.value.textContent)
    : object.value;
  return [label];
};

export const RDFA_VISUALIZER_CONFIG: RdfaVisualizerConfig = {
  displayConfig: {
    predicate: humanReadablePredicate,
    ResourceNode: humanReadableSubject,
    NamedNode: humanReadableObject_NamedNode,
    Literal: humanReadableObject_Literal,
    LiteralNode: humanReadableObject_LiteralNode,
  },
};
