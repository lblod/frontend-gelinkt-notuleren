import {
  classicRdfaAttrSpec,
  getClassicRdfaAttrs,
  getRdfaAttrs,
  getRdfaContentElement,
  rdfaAwareAttrSpec,
  renderRdfaAware,
} from '../../../core/schema';
import {
  createEmberNodeSpec,
  createEmberNodeView,
  type EmberNodeConfig,
} from '../../../utils/ember-node';
import type { ComponentLike } from '@glint/template';
import Link from '@lblod/ember-rdfa-editor/components/ember-node/link';

type LinkOptions = {
  interactive?: boolean;
  rdfaAware?: boolean;
};

// TODO this spec doesn't play well with RDFa editing tools. It has been modified so that any
// additional RDFa annotations are not striped. This is for example, used by the citation plugin in
// lblod-plugins
const emberNodeConfig: (options?: LinkOptions) => EmberNodeConfig = ({
  interactive = false,
  rdfaAware = false,
} = {}) => {
  return {
    name: 'link',
    component: Link as unknown as ComponentLike,
    inline: true,
    group: 'inline',
    content: 'text*',
    atom: true,
    defining: true,
    draggable: false,
    get attrs() {
      const baseAttrs = {
        href: {
          default: null,
        },
        interactive: {
          default: interactive,
        },
      };
      if (rdfaAware) {
        return {
          ...rdfaAwareAttrSpec,
          ...baseAttrs,
        };
      } else {
        return { ...classicRdfaAttrSpec, ...baseAttrs };
      }
    },
    needsFFKludge: true,
    needsChromeCursorFix: true,
    get parseDOM() {
      return [
        {
          tag: 'a',
          getAttrs(dom: string | HTMLElement) {
            if (typeof dom === 'string') {
              return false;
            }
            const href = dom.getAttribute('href');
            if (rdfaAware) {
              return {
                ...getRdfaAttrs(dom),
                href,
              };
            } else {
              return {
                ...getClassicRdfaAttrs(dom),
                href,
              };
            }
          },
          contentElement: getRdfaContentElement,
        },
      ];
    },
    toDOM(node) {
      const { interactive: _, placeholder: __, ...attrs } = node.attrs;
      if (rdfaAware) {
        return renderRdfaAware({
          renderable: node,
          tag: 'a',
          attrs,
          content: 0,
        });
      } else {
        return ['a', attrs, 0];
      }
    },
  };
};

export const link = (options?: LinkOptions) =>
  createEmberNodeSpec(emberNodeConfig(options));

export const linkView = (options?: LinkOptions) =>
  createEmberNodeView(emberNodeConfig(options));
