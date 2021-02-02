import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class RdfaEditorContainerComponent extends Component {
  get editorOptions() {
    return {
      showToggleRdfaAnnotations: Boolean(this.args.showToggleRdfaAnnotations),
      showInsertButton: true,
      showRdfa: true,
      showRdfaHighlight: true,
      showRdfaHover: true

    };
  }

  get documentContext() {
    try {
      return JSON.parse(this.args.editorDocument.context);
    }
    catch(e) {
      return {
        prefix: "",
        typeof: "",
        vocab: ""
      };
    }
  }

  get vocab() {
    return this.documentContext['vocab'];
  }

  /**
   * this is a workaround because emberjs does not allow us to assign the prefix attribute in the template
   */
  @action
  setPrefix(element) {
    element.setAttribute('prefix', this.prefixToAttrString(this.documentContext.prefix));
  }

  prefixToAttrString(prefix){
    let attrString = '';
    Object.keys(prefix).forEach(key => {
      let uri = prefix[key];
      attrString += `${key}: ${uri} `;
    });
    return attrString;
  }
}
