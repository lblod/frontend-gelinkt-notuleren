import Component from '@ember/component';

export default Component.extend({
  rdfaEditorContainerReady: false,
  classNames: ['container-flex--contain'],

  setRdfaContext(element){
    element.setAttribute('vocab', JSON.parse(this.get('editorDocument.context'))['vocab']);
    element.setAttribute('prefix', this.prefixToAttrString(JSON.parse(this.get('editorDocument.context'))['prefix']));
    element.setAttribute('typeof', this.typeOfWrappingDiv);
    element.setAttribute('resource', '#');
  },

  prefixToAttrString(prefix){
    let attrString = '';
    Object.keys(prefix).forEach(key => {
      let uri = prefix[key];
      attrString += `${key}: ${uri} `;
    });
    return attrString;
  },

  didInsertElement() {
    this._super(...arguments);
    this.setRdfaContext(this.element);
    this.set('rdfaEditorContainerReady', true);
  },

  actions: {
    updateTasklists(tasklists){
      this.onUpdateTasklists(tasklists);
    },

    handleRdfaEditorInit(editor){
      this.rdfaEditorContainerInit(editor);
    }
  }
});
