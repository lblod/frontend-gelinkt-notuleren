import {
  getNodeByRdfaId,
  type DisplayGenerator,
  type RdfaVisualizerConfig,
} from '@lblod/ember-rdfa-editor/plugins/rdfa-info';
import type { OutgoingTriple } from '@lblod/ember-rdfa-editor/core/rdfa-processor';
import type { PNode } from '@lblod/ember-rdfa-editor';
import {
  isSome,
  optionMap,
} from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import { getOutgoingTriple } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/namespace';
import {
  ELI,
  RDF,
  SKOS,
} from '@lblod/ember-rdfa-editor-lblod-plugins/utils/constants';

const humanReadablePredicateDisplay: DisplayGenerator<OutgoingTriple> = (
  triple,
) => {
  return {
    meta: { title: triple.predicate },
    elements: [
      { strong: 'predicate:' },
      triple.predicate.split(/[/#]/).at(-1) ?? triple.predicate,
    ],
  };
};

const humanReadableResourceName: DisplayGenerator<PNode> = (
  node,
  { controller },
) => {
  const subject = node.attrs['subject'] as string;

  const label = optionMap(
    (triple) => triple.object?.value,
    getOutgoingTriple(node.attrs, SKOS('prefLabel')),
  );
  if (isSome(label)) {
    return [{ strong: label }];
  }

  const type = optionMap(
    (triple) => triple.object?.value,
    getOutgoingTriple(node.attrs, RDF('type')),
  );
  if (isSome(type)) {
    if (type === 'http://data.vlaanderen.be/ns/besluit#Besluit') {
      const title = optionMap(
        (triple) => triple.object?.value,
        getOutgoingTriple(node.attrs, ELI('title')),
      );
      const titleNode = title
        ? getNodeByRdfaId(controller.mainEditorState, title)
        : undefined;
      return [
        { pill: 'Besluit' },
        titleNode?.value.textContent ?? title ?? subject,
      ];
    } else {
      return [{ strong: `${type.split(/[/#]/).at(-1)}:` }, subject];
    }
  }
  return [subject];
};

export const RDFA_VISUALIZER_CONFIG: RdfaVisualizerConfig = {
  displayConfig: {
    predicate: humanReadablePredicateDisplay,
    ResourceNode: humanReadableResourceName,
  },
};
