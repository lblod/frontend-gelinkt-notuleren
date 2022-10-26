// import ReadOnlyContentSectionSpec from './inline-components/read-only-content-section';

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
  }
}
