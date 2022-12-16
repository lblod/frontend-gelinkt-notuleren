import {
  createEmberNodeSpec,
  createEmberNodeView,
} from '@lblod/ember-rdfa-editor/utils/ember-node';

const emberNodeConfig = {
  name: 'regulatory-statement-view',
  componentPath: 'editor-plugins/regulatory-statements/view',
  inline: false,
  group: 'block',
  atom: true,
  attrs: {
    resource: {
      parse: (element) => {
        return element.getAttribute('resource');
      },
    },
    title: { default: '' },
    content: { default: '' },
  },
  toDOM: (node) => {
    const parser = new DOMParser();
    const html = parser.parseFromString(node.attrs['content'], 'text/html');
    return [
      'div',
      {
        'data-ember-node': 'regulatory-statement-view',
        resource: node.attrs['resource'],
        property: 'eli:related_to',
        rev: 'dct:isPartOf',
        typeof: 'besluitpublicatie:Documentonderdeel',
      },
      ['h5', {}, `Reglementaire bijlage: ${node.attrs['title']}`],
      ['div', {}, ...html.body.childNodes],
    ];
  },
};

export const regulatoryStatementNode = createEmberNodeSpec(emberNodeConfig);
export const regulatoryStatementNodeView = createEmberNodeView(emberNodeConfig);

export const regulatoryStatementWidget = {
  desiredLocation: 'insertSidebar',
  componentName: 'editor-plugins/regulatory-statements/sidebar-insert',
};
