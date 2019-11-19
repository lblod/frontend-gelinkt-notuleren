import EditorProperty from '../ce/editor-property';

/**
 * Editor property that represents underlined text.
 * @module rdfa-editor
 * @class StrikethroughProperty
 * @constructor
 * @extends EditorProperty
 * @public
 */
class StrikethroughProperty extends EditorProperty {
  constructor({tagName = 's', newContext = true}) {
    super({tagName, newContext});
  }
  enabledAt(richNode) {
    if (!richNode)
      return false;
    if (richNode.type === 'text') {
      return window.getComputedStyle(richNode.parent.domNode).textDecoration.includes("line-through");
    }
    else if (richNode.type === 'tag') {
      return window.getComputedStyle(richNode.domNode).textDecoration.includes("line-through");
    }
    else
      return false;
  }
}
const strikethroughProperty = new StrikethroughProperty({});
export default strikethroughProperty;
