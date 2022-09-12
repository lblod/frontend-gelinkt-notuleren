import Controller from '@ember/controller';
import { action } from '@ember/object';
import { PLUGIN_CONFIGS } from 'frontend-gelinkt-notuleren/config/constants';

export default class RegulatoryStatementsRoute extends Controller {
  plugins = [
    'article-structure',
    { name: 'rdfa-toc', options: { config: PLUGIN_CONFIGS.TABLE_OF_CONTENTS } },
  ];

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
