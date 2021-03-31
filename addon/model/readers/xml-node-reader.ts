import ModelNode from "@lblod/ember-rdfa-editor/model/model-node";
import Reader from "@lblod/ember-rdfa-editor/model/readers/reader";
import XmlElementReader from "@lblod/ember-rdfa-editor/model/readers/xml-element-reader";
import XmlTextReader from "@lblod/ember-rdfa-editor/model/readers/xml-text-reader";
import {isElement} from "@lblod/ember-rdfa-editor/utils/dom-helpers";
import {XmlNodeRegistry} from "@lblod/ember-rdfa-editor/model/readers/xml-reader";
import ModelElement from "@lblod/ember-rdfa-editor/model/model-element";
import ModelText from "@lblod/ember-rdfa-editor/model/model-text";

export default class XmlNodeReader implements Reader<Node, ModelNode | null> {
  private elementReader: XmlElementReader;
  private textReader: XmlTextReader;

  constructor(private elementRegistry: XmlNodeRegistry<ModelElement>, private textRegistry: XmlNodeRegistry<ModelText>) {
    this.elementReader = new XmlElementReader(elementRegistry, textRegistry);
    this.textReader = new XmlTextReader(textRegistry);
  }

  read(from: Node): ModelNode | null {
    if (isElement(from)) {
      if (from.tagName === "text") {
        return this.textReader.read(from);
      }
      return this.elementReader.read(from as Element);
    } else {
      return null;
    }


  }

}
