import {
  Mark,
  MarkSpec,
  TagMatch,
} from '@lblod/ember-rdfa-editor/core/model/marks/mark';
import MapUtils from '@lblod/ember-rdfa-editor/utils/map-utils';
import { isElement, tagName } from '@lblod/ember-rdfa-editor/utils/dom-helpers';
import ModelText from '@lblod/ember-rdfa-editor/core/model/nodes/model-text';
import { CORE_OWNER } from '@lblod/ember-rdfa-editor/utils/constants';
import HashSet from '@lblod/ember-rdfa-editor/utils/hash-set';
import EventBus from '@lblod/ember-rdfa-editor/utils/event-bus';
import { ContentChangedEvent } from '@lblod/ember-rdfa-editor/utils/editor-event';
import ModelNode from '@lblod/ember-rdfa-editor/core/model/nodes/model-node';
import GenTreeWalker from '@lblod/ember-rdfa-editor/utils/gen-tree-walker';
import { toFilterSkipFalse } from '@lblod/ember-rdfa-editor/utils/model-tree-walker';
import { AttributeSpec } from '../../../utils/render-spec';
import Controller from '@ember/controller';
import Transaction from '../../state/transaction';
import { Step } from '../../state/steps/step';

export interface SpecAttributes {
  spec: MarkSpec;
  attributes: AttributeSpec;
}

export default class MarksRegistry {
  /**
   * A map of all unique markNames in the document
   * onto the nodes that have them currently active
   * @private
   */
  private markStore: Map<string, Set<ModelText>> = new Map<
    string,
    Set<ModelText>
  >();
  /**
   * A map of html element tagnames onto the markspecs that
   * match on them.
   * @private
   */
  private markMatchMap: Map<TagMatch, MarkSpec[]> = new Map<
    keyof HTMLElementTagNameMap,
    MarkSpec[]
  >();
  /**
   * A registry of the currently supported markSpecs in the document
   * @private
   */
  private registeredMarks: Map<string, MarkSpec> = new Map<string, MarkSpec>();

  updateMarks = ({
    insertedNodes,
    overwrittenNodes,
    markCheckNodes,
  }: {
    insertedNodes: ModelNode[];
    overwrittenNodes: ModelNode[];
    markCheckNodes: ModelNode[];
  }) => {
    console.log('UPDATE MARKS');
    this.updateMarksForNodes(insertedNodes);
    this.updateMarksForNodes(markCheckNodes);
    this.removeMarksForNodes(overwrittenNodes);
  };

  private updateMarksForNodes(nodes: ModelNode[]) {
    for (const node of nodes) {
      const walker = GenTreeWalker.fromSubTree({
        root: node,
        filter: toFilterSkipFalse<ModelNode>(ModelNode.isModelText),
      });
      for (const textNode of walker.nodes() as Generator<ModelText>) {
        for (const mark of textNode.marks) {
          const owner = mark.attributes.setBy || CORE_OWNER;
          const ownerNodes = this.markStore.get(owner);
          if (ownerNodes) {
            if (textNode.marks.size) {
              ownerNodes.add(textNode);
            } else {
              ownerNodes.delete(textNode);
            }
          } else {
            this.markStore.set(owner, new Set([textNode]));
          }
        }
      }
    }
  }

  private removeMarksForNodes(nodes: ModelNode[]) {
    for (const node of nodes) {
      const walker = GenTreeWalker.fromSubTree({
        root: node,
        filter: toFilterSkipFalse<ModelNode>(ModelNode.isModelText),
      });
      for (const textNode of walker.nodes() as Generator<ModelText>) {
        for (const mark of textNode.marks) {
          const owner = mark.attributes.setBy || CORE_OWNER;
          const ownerNodes = this.markStore.get(owner);
          if (ownerNodes) {
            ownerNodes.delete(textNode);
          }
        }
      }
    }
  }

  matchMarkSpec(node: Node): Set<SpecAttributes> {
    const setBy = isElement(node)
      ? node.dataset['__setBy'] || CORE_OWNER
      : CORE_OWNER;

    const potentialMatches =
      this.markMatchMap.get(tagName(node) as TagMatch) || [];
    const defaultMatches = this.markMatchMap.get('*') || [];

    const result = new HashSet<SpecAttributes>({
      hashFunc: (specAttr) =>
        specAttr.spec.name + JSON.stringify(specAttr.attributes),
    });
    potentialMatches.concat(defaultMatches);
    for (const spec of potentialMatches) {
      for (const matcher of spec.matchers) {
        if (matcher.attributeBuilder) {
          const attributes = matcher.attributeBuilder(node);
          if (attributes) {
            result.add({ spec, attributes: { setBy, ...attributes } });
          }
        } else {
          result.add({ spec, attributes: { setBy } });
        }
      }
    }
    return result;
  }

  addMark<A extends AttributeSpec>(
    node: ModelText,
    spec: MarkSpec<A>,
    attributes: A
  ) {
    const mark = new Mark(spec, attributes, node);
    node.addMark(mark);
    MapUtils.setOrAdd(
      this.markStore,
      attributes.setBy ?? CORE_OWNER,
      mark.node
    );
  }

  removeMarkByName(node: ModelText, markName: string) {
    node.removeMarkByName(markName);
    const mark = node.marks.lookupHash(markName);
    if (mark) {
      const marks = this.markStore.get(mark.attributes.setBy ?? CORE_OWNER);
      if (marks && mark.node) {
        marks.delete(mark.node);
      }
    }
  }

  lookupMark(name: string): MarkSpec | null {
    return this.registeredMarks.get(name) || null;
  }

  registerMark(mark: MarkSpec) {
    this.registeredMarks.set(mark.name, mark);
    for (const matcher of mark.matchers) {
      MapUtils.setOrPush(this.markMatchMap, matcher.tag, mark);
    }
  }

  getMarksFor(name: string): Set<Mark> {
    const nodes = this.markStore.get(name);
    const result = new Set<Mark>();
    if (nodes) {
      for (const node of nodes) {
        for (const mark of node.marks) {
          if (mark.attributes.setBy === name) {
            result.add(mark);
          }
        }
      }
    }
    return result;
  }

  clear() {
    this.markStore.clear();
  }
}
