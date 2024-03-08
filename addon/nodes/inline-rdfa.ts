import { Node as PNode } from 'prosemirror-model';
import {
  classicRdfaAttrSpec,
  getClassicRdfaAttrs,
  getRdfaAttrs,
  getRdfaContentElement,
  rdfaAwareAttrSpec,
  renderRdfaAware,
} from '../core/schema';
import {
  type EmberNodeConfig,
  createEmberNodeSpec,
  createEmberNodeView,
} from '../utils/ember-node';
import InlineRdfaComponent from '../components/ember-node/inline-rdfa';
import type { ComponentLike } from '@glint/template';

type Options = {
  rdfaAware?: boolean;
};

const emberNodeConfig: (options?: Options) => EmberNodeConfig = ({
  rdfaAware = false,
} = {}) => {
  return {
    name: 'inline-rdfa',
    inline: true,
    component: InlineRdfaComponent as unknown as ComponentLike,
    group: 'inline',
    content: 'inline*',
    atom: true,
    draggable: false,
    selectable: true,
    toDOM(node: PNode) {
      if (rdfaAware) {
        return renderRdfaAware({
          renderable: node,
          tag: 'span',
          attrs: { class: 'say-inline-rdfa' },
          content: 0,
        });
      } else {
        return ['span', { ...node.attrs, class: 'say-inline-rdfa' }, 0];
      }
    },
    parseDOM: [
      {
        tag: 'span',
        // default prio is 50, highest prio comes first, and this parserule should at least come after all other nodes
        priority: 10,
        getAttrs(node: string | HTMLElement) {
          if (typeof node === 'string') {
            return false;
          }
          const attrs = rdfaAware
            ? getRdfaAttrs(node)
            : getClassicRdfaAttrs(node);
          if (attrs) {
            return attrs;
          }
          return false;
        },
        contentElement: getRdfaContentElement,
      },
    ],
    get attrs() {
      if (rdfaAware) {
        return rdfaAwareAttrSpec;
      } else {
        return classicRdfaAttrSpec;
      }
    },
  };
};

export const inline_rdfa = (options?: Options) =>
  createEmberNodeSpec(emberNodeConfig(options));

export const inlineRdfaView = (options?: Options) =>
  createEmberNodeView(emberNodeConfig(options));
