import Component from '@glimmer/component';
import { action } from '@ember/object';
import generateExportFromEditorDocument from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';

export default class DownloadDocumentComponent extends Component {
  @action
  download() {
    const content = this.args.content ?? this.args.document.content;
    generateExportFromEditorDocument(
      {
        title: this.args.document.title,
        context: this.args.document.context,
        content,
      },
      this.args.forPublish,
    );
  }
}
