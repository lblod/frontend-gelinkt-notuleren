import { tagName } from '@lblod/ember-rdfa-editor/utils/dom-helpers';
import { TagMatch } from '../mark';
import { tracked, TrackedMap } from 'tracked-built-ins';
import MapUtils from '../util/map-utils';
import {
  InlineComponentSpec,
  ModelInlineComponent,
} from './model-inline-component';
import Controller from '../controller';
import { ComponentNotFoundError } from '@lblod/ember-rdfa-editor/utils/errors';
import InlineComponentController from './inline-component-controller';
import ModelElement from '../model-element';
import { toFilterSkipFalse } from '../util/model-tree-walker';
import GenTreeWalker from '../util/gen-tree-walker';
import ModelNode from '../model-node';

export interface InlineComponentsRegistryArgs {
  registeredComponents?: Map<string, InlineComponentSpec>;
  componentMatchMap?: Map<TagMatch, InlineComponentSpec[]>;
  activeComponents?: Map<ModelInlineComponent, ActiveComponentEntry>;
}

export type ActiveComponentEntry = {
  emberComponentName: string;
  node: HTMLElement;
  componentController: InlineComponentController;
  editorController: Controller;
};
export default class InlineComponentsRegistry {
  private registeredComponents: Map<string, InlineComponentSpec>;
  private componentMatchMap: Map<TagMatch, InlineComponentSpec[]>;
  @tracked activeComponents: TrackedMap<
    ModelInlineComponent,
    ActiveComponentEntry
  >;

  constructor(args?: InlineComponentsRegistryArgs) {
    this.registeredComponents =
      args?.registeredComponents ?? new Map<string, InlineComponentSpec>();
    this.componentMatchMap =
      args?.componentMatchMap ?? new Map<TagMatch, InlineComponentSpec[]>();
    this.activeComponents = tracked(
      args?.activeComponents ??
        new Map<ModelInlineComponent, ActiveComponentEntry>()
    );
  }

  matchInlineComponentSpec(node: Node): InlineComponentSpec | null {
    const potentialMatches =
      this.componentMatchMap.get(tagName(node) as TagMatch) || [];

    let result: InlineComponentSpec | null = null;

    for (const spec of potentialMatches) {
      if (spec.matcher.attributeBuilder) {
        const baseAttributesMatch = spec.matcher.attributeBuilder(node);
        if (baseAttributesMatch) {
          result = spec;
          break;
        }
      } else {
        result = spec;
      }
    }

    return result;
  }

  registerComponent(componentSpec: InlineComponentSpec) {
    this.registeredComponents.set(componentSpec.name, componentSpec);
    MapUtils.setOrPush(
      this.componentMatchMap,
      componentSpec.matcher.tag,
      componentSpec
    );
  }

  lookUpComponent(name: string) {
    return this.registeredComponents.get(name);
  }

  clearComponentInstances() {
    this.activeComponents.clear();
  }

  addComponentInstance(
    node: HTMLElement,
    emberComponentName: string,
    model: ModelInlineComponent
  ) {
    const componentSpec = this.lookUpComponent(emberComponentName);
    if (componentSpec) {
      const componentController = new InlineComponentController(model, node);
      this.activeComponents.set(model, {
        emberComponentName,
        node,
        componentController,
        editorController: componentSpec.controller,
      });
    } else {
      throw new ComponentNotFoundError(
        `Component ${emberComponentName} not found`
      );
    }
  }

  updateComponentInstanceNode(model: ModelInlineComponent, node: HTMLElement) {
    const entry = this.activeComponents.get(model);
    if (entry) {
      entry.node = node;
    }
  }

  clone(oldDocument: ModelElement, newDocument: ModelElement) {
    const updatedActiveComponents = new Map<
      ModelInlineComponent,
      ActiveComponentEntry
    >();
    const oldInlineComponentModels = GenTreeWalker.fromSubTree({
      root: oldDocument,
      filter: toFilterSkipFalse((node: ModelNode) =>
        ModelNode.isModelInlineComponent(node)
      ),
    });
    const newInlineComponentModels = GenTreeWalker.fromSubTree({
      root: newDocument,
      filter: toFilterSkipFalse((node: ModelNode) =>
        ModelNode.isModelInlineComponent(node)
      ),
    });
    let oldInlineComponent =
        oldInlineComponentModels.nextNode() as ModelInlineComponent,
      newInlineComponent =
        newInlineComponentModels.nextNode() as ModelInlineComponent;
    while (oldInlineComponent && newInlineComponent) {
      const oldComponentEntry = this.componentInstances.get(oldInlineComponent);
      if (oldComponentEntry) {
        const newComponentEntry: ActiveComponentEntry = {
          node: oldComponentEntry.node,
          componentController: new InlineComponentController(
            newInlineComponent,
            oldComponentEntry.node
          ),
          emberComponentName: oldComponentEntry.emberComponentName,
          editorController: oldComponentEntry.editorController,
        };
        updatedActiveComponents.set(newInlineComponent, newComponentEntry);
      }

      oldInlineComponent =
        oldInlineComponentModels.nextNode() as ModelInlineComponent;
      newInlineComponent =
        newInlineComponentModels.nextNode() as ModelInlineComponent;
    }
    return new InlineComponentsRegistry({
      registeredComponents: this.registeredComponents,
      componentMatchMap: this.componentMatchMap,
      activeComponents: updatedActiveComponents,
    });
  }

  get componentInstances() {
    return this.activeComponents;
  }

  clean() {
    this.componentInstances.forEach((entry, model) => {
      if (!entry.node.isConnected) {
        this.componentInstances.delete(model);
      }
    });
  }
}
