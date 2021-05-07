import Component from '@glimmer/component';
import { task } from "ember-concurrency-decorators";
import { action } from "@ember/object";

export default class ZittingTextDocumentContainerComponent extends Component {
  constructor(...args) {
    super(...args);
    this.getText.perform();
  }

  profile = 'none';
  editor;
  type = this.args.type;
  text;

  editorOptions = {
    showToggleRdfaAnnotations: false,
    showInsertButton: true,
    showRdfa: false,
    showRdfaHighlight: false,
    showRdfaHover: false
  };

  @task
  *getText() {
    const zitting = yield this.args.zitting;    
    if(zitting && !zitting.intro){
      zitting.intro="";
    }
    if (this.type === 'ext:intro') {
      this.text = yield zitting.intro;
    }
    else if (this.type === 'ext:outro') {
      this.text = yield zitting.outro;
    }
  }

  @task
  *saveText() {
    const zitting = yield this.args.zitting;
    this.text = this.editor.htmlContent;

    if (this.type === 'ext:intro') {
      zitting.intro = this.text;
    }
    else if (this.type === 'ext:outro') {
      zitting.outro = this.text;
    }
    yield zitting.save();
  }

  @action
  handleRdfaEditorInit(editor) {
    editor.setHtmlContent(this.text);
    this.editor = editor;
  }

}
