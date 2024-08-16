import {
  createEmberNodeSpec,
  createEmberNodeView,
} from '@lblod/ember-rdfa-editor/utils/ember-node';
import ReadOnlyContentSectionComponent from 'frontend-gelinkt-notuleren/components/editor-plugins/regulatory-statements/view';

/**
 * @typedef {import('@lblod/ember-rdfa-editor/utils/ember-node').EmberNodeConfig} EmberNodeConfig
 */

/**
 * @type {EmberNodeConfig}
 */
const emberNodeConfig = {
  name: 'regulatory-statement-view',
  component: ReadOnlyContentSectionComponent,
  inline: false,
  group: 'block',
  atom: true,
  attrs: {
    resource: {},
    title: { default: '' },
    content: { default: '' },
    oldContent: { default: ''}
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
        'data-rs-content':  node.attrs['content'],
        'data-rs-title': node.attrs['title']
      },
      ['h5', {}, `Reglementaire bijlage: ${node.attrs['title']}`],
      ['div', {}, ...html.body.childNodes],
    ];
  },
  parseDOM: [
    {
      tag: 'div',
      getAttrs(element) {
        const oldContent = element.dataset.rsContent;
        const title = element.dataset.rsTitle
        if (element.dataset['emberNode'] === 'regulatory-statement-view') {
          return {
            resource: element.getAttribute('resource'),
            oldContent,
            title
          };
        } else if (
          element.dataset.inlineComponent ===
            'editor-plugins/regulatory-statements/view' &&
          element.dataset.props
        ) {
          // This is to ensure backwards compatibility
          const propsParsed = JSON.parse(element.dataset.props);
          return {
            resource: propsParsed['uri'],
            oldContent,
            title
          };
        }
        return false;
      },
    },
  ],
};

export const regulatoryStatementNode = createEmberNodeSpec(emberNodeConfig);
export const regulatoryStatementNodeView = createEmberNodeView(emberNodeConfig);

export const regulatoryStatementWidget = {
  desiredLocation: 'insertSidebar',
  componentName: 'editor-plugins/regulatory-statements/sidebar-insert',
};
