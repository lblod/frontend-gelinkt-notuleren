import PernetRawEditor from '../ce/pernet-raw-editor';
import HTMLExportWriter from '@lblod/ember-rdfa-editor/model/writers/html-export-writer';

/**
 * RdfaDocument is a virtual representation of the document
 * it creates a DOM copy that does not include highlights
 * both richNode and rootNode are calculated on the fly.
 *
 * This is both to protect the internal dom of the editor and to remove internals
 */
export default class RdfaDocument {
  private _editor: PernetRawEditor;

  constructor(editor: PernetRawEditor) {
    this._editor = editor;
  }

  get htmlContent() {
    const htmlWriter = new HTMLExportWriter(this._editor.model);
    const output = (htmlWriter.write(this._editor.model.rootModelNode) as HTMLElement);
    return output.innerHTML;
  }

  set htmlContent(html: string) {
    this._editor.executeCommand("insert-html", html, this._editor.createRangeFromPaths([], []));
  }

  setHtmlContent(html: string) {
    this.htmlContent = html;
  }
}
