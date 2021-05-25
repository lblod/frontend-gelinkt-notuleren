import Component from '@glimmer/component';
import { task } from "ember-concurrency";
import { action } from "@ember/object";

export default class ZittingTextDocumentContainerComponent extends Component {
  constructor(...args) {
    super(...args);
  }

  profile = 'none';
  editor;
  type = this.args.type;

  editorOptions = {
    showToggleRdfaAnnotations: false,
    showInsertButton: false,
    showRdfa: false,
    showRdfaHighlight: false,
    showRdfaHover: false
  };

  get text(){
    const zitting = this.args.zitting;
    if (this.type === 'ext:intro') {
      return zitting.intro;
    }
    else if (this.type === 'ext:outro') {
      return zitting.outro;
    }
    else{
      return "";
    }
  }

  @task
  *saveText() {
    const zitting = this.args.zitting;

    if (this.type === 'ext:intro') {
      zitting.intro = this.editor.htmlContent;
    }
    else if (this.type === 'ext:outro') {
      zitting.outro = this.editor.htmlContent;
    }
    yield zitting.save();
  }

  @action
  handleRdfaEditorInit(editor) {
    editor.setHtmlContent(this.text);
    this.editor = editor;
  }

}
