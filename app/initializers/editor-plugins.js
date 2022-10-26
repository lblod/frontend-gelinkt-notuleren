import RegulatoryStatementsPlugin from '../editor-plugins/regulatory-statements-plugin';

function pluginFactory(plugin) {
  return {
    create: (initializers) => {
      const pluginInstance = new plugin();
      Object.assign(pluginInstance, initializers);
      return pluginInstance;
    },
  };
}

export function initialize(application) {
  application.register(
    'plugin:regulatory-statements',
    pluginFactory(RegulatoryStatementsPlugin),
    {
      singleton: false,
    }
  );
}

export default {
  initialize,
};
