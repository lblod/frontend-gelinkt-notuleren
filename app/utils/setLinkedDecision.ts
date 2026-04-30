import type { EditorState } from '@lblod/ember-rdfa-editor';
import { getCurrentBesluitURI } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/decision-utils';
import {
  addPropertyToNode,
  removePropertyFromNode,
} from '@lblod/ember-rdfa-editor/utils/rdfa-utils';
import { getCurrentBesluitRange } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/decision-utils';
import { getOutgoingTripleList } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/namespace';
import { ELI } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/constants';
import { type OutgoingTriple } from '@lblod/ember-rdfa-editor/core/rdfa-processor';
import { sayDataFactory } from '@lblod/ember-rdfa-editor/core/say-data-factory';
import {
  transactionCombinator,
  type TransactionCombinatorResult,
} from '@lblod/ember-rdfa-editor/utils/transaction-utils';

export default function setLinkedDecision(
  initialState: EditorState,
  linkedDecisionUri: string,
): TransactionCombinatorResult<boolean> {
  const transaction = initialState.tr;
  const resource = getCurrentBesluitURI(initialState);
  if (!resource) {
    return {
      result: [false],
      initialState,
      transaction,
      transactions: [transaction],
    };
  }
  const existingLinkedDecisionUris = extractLinkedDecisionUris(initialState);
  const monads = existingLinkedDecisionUris.map((existingUri) => {
    return removePropertyFromNode({
      resource,
      property: {
        predicate: ELI('consolidates').full,
        object: sayDataFactory.namedNode(existingUri),
      },
    });
  });
  monads.push(
    addPropertyToNode({
      resource,
      property: {
        predicate: ELI('consolidates').full,
        object: sayDataFactory.namedNode(linkedDecisionUri),
      },
    }),
  );
  return transactionCombinator<boolean>(initialState)(monads);
}

export function extractLinkedDecisionUris(editorState: EditorState): string[] {
  const besluitRange = getCurrentBesluitRange(editorState);
  if (!besluitRange) {
    return [];
  }
  return getOutgoingTripleList(besluitRange.node.attrs, ELI('consolidates'))
    .filter((type) => type.object.termType === 'NamedNode')
    .map((type: OutgoingTriple) => type?.object.value);
}
