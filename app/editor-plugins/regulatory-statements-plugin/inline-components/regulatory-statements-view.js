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
    return `<div resource="${props.uri}" property="eli:related_to" rev="dct:isPartOf" typeof="besluitpublicatie:Documentonderdeel">
              <h5>Reglementaire bijlage: ${state.title}</h5>
              <a
                href="${state.url}"
                >Link</a>
            </div>`;
  }
  constructor(controller) {
    super('editor-plugins/regulatory-statements/view', 'div', controller);
  }
}
