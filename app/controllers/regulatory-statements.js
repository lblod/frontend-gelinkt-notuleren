import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class RegulatoryStatementsRoute extends Controller {
  @action
  rdfaEditorInit(controller) {
    controller.executeCommand(
      'insert-component',
      'inline-components/table-of-contents',
      {},
      {},
      false
    );
  }
}
