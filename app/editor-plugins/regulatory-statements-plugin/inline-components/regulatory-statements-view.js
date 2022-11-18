import { InlineComponentSpec } from '@lblod/ember-rdfa-editor/model/inline-components/model-inline-component';
import { isElement } from '@lblod/ember-rdfa-editor/utils/dom-helpers';
export default class RegulatoryStatementsViewSpec extends InlineComponentSpec {
  matcher = {
    tag: this.tag,
    attributeBuilder: (node) => {
      if (isElement(node)) {
        if (node.dataset.inlineComponent === this.name) {
          return {};
        }
      }
      return null;
    },
  };
  properties = {
    uri: { serializable: true },
  };
  _renderStatic(props) {
    return `<br>
            <div resource="${props.uri}" property="eli:related_to" rev="dct:isPartOf" typeof="besluitpublicatie:Documentonderdeel">
              <h5>Reglementaire bijlage: ${props.title}</h5>
              <div>
                ${props.content}
              </div>
            </div>`;
  }
  constructor(controller) {
    super('editor-plugins/regulatory-statements/view', 'div', controller);
  }
}
