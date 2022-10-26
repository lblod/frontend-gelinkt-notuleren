import RegulatoryStatementsViewSpec from './inline-components/regulatory-statements-view';

export default class RegulatoryStatementsPlugin {
  get name() {
    return 'regulatory-statements';
  }

  initialize(controller) {
    controller.registerWidget({
      desiredLocation: 'insertSidebar',
      componentName: 'editor-plugins/regulatory-statements/sidebar-insert',
      identifier: 'editor-plugins/regulatory-statements/sidebar-insert',
    });
    controller.registerInlineComponent(
      new RegulatoryStatementsViewSpec(controller)
    );
  }
}
