import { InlineComponentSpec } from '@lblod/ember-rdfa-editor/model/inline-components/model-inline-component';
import { isElement } from '@lblod/ember-rdfa-editor/utils/dom-helpers';
export default class RegulatoryStatementsViewSpec extends InlineComponentSpec {
  matcher = {
    tag: this.tag,
    attributeBuilder: (node) => {
      if (isElement(node)) {
        if (
          node.classList.contains('inline-component') &&
          node.classList.contains(this.name)
        ) {
          return {};
        }
      }
      return null;
    },
  };
  _renderStatic(props, state) {
    return `<p>
              Reglementaire bijlage:
              <a
                href="${state.url}"
                property="dct:hasPart"
                typeof="besluitpublicatie:Documentonderdeel"
                resource="${props.uri}"
                >${state.title}</a>
            </p>`;
  }
  constructor(controller) {
    super('editor-plugins/regulatory-statements/view', 'div', controller);
  }
}
