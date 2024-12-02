import { SayDataFactory } from '@lblod/ember-rdfa-editor/core/say-data-factory';
import { transactionCombinator } from '@lblod/ember-rdfa-editor/utils/transaction-utils';
import { addPropertyToNode } from '@lblod/ember-rdfa-editor/utils/rdfa-utils';
import { hasOutgoingNamedNodeTriple } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/namespace';
import {
  RDF,
  BESLUIT,
} from '@lblod/ember-rdfa-editor-lblod-plugins/utils/constants';
import { findChildren } from '@curvenote/prosemirror-utils';

export function fixArticleConnections(editorController) {
  const state = editorController.mainEditorState;
  const decisions = findDecisions(state.doc, editorController.schema);
  if (!decisions.length) {
    return false;
  }
  const transactionMonads = [];
  const factory = new SayDataFactory();
  for (const decision of decisions) {
    const unconnectedArticles = findUnconnectedArticles(
      decision.node,
      editorController.schema,
    );
    for (const article of unconnectedArticles) {
      transactionMonads.push(
        addPropertyToNode({
          resource: decision.node.attrs.subject,
          property: {
            predicate: 'http://data.europa.eu/eli/ontology#has_part',
            object: factory.resourceNode(article.node.attrs.subject),
          },
        }),
      );
    }
  }
  if (!transactionMonads.length) {
    return false;
  }
  editorController.withTransaction((tr) => {
    const result = transactionCombinator(
      editorController.mainEditorState,
      tr,
    )(transactionMonads);
    result.transaction.setMeta('addToHistory', false);
    return result.transaction;
  });
  return true;
}

function findDecisions(doc, schema) {
  const decisions = findChildren(doc, (child) => {
    return (
      child.type === schema.nodes.block_rdfa &&
      hasOutgoingNamedNodeTriple(child.attrs, RDF('type'), BESLUIT('Besluit'))
    );
  });
  return decisions;
}

function findUnconnectedArticles(decisionNode, schema) {
  const decisionURI = decisionNode.subject;
  const articles = findChildren(decisionNode, (child) => {
    return (
      child.type === schema.nodes.structure &&
      child.attrs.structureType === 'article' &&
      !isConnectedTo(child, decisionURI)
    );
  });
  return articles;
}

function isConnectedTo(articleNode, decisionURI) {
  return Boolean(
    (articleNode.attrs.backlinks ?? []).some(
      (backlink) =>
        backlink.subject === decisionURI &&
        backlink.predicate == 'http://data.europa.eu/eli/ontology#has_part',
    ),
  );
}
