export function initialize(appInstance) {
  const store = appInstance.lookup('service:store');
  
  window.onerror = async function (msg, url, lineNo, columnNo, error) {
    const logSource = await store.findRecord('log-source', 'F400FB90-81F6-4F49-B4F5-CDFAD0DA1243');
    const logLevel = await store.findRecord('log-level', '3af9ebe1-e6a8-495c-a392-16ced1f38ef1');
    const logEntry = store.createRecord('log-entry', {
      message: msg,
      specificInformation: error.stack,
      datetime: new Date(),
      logSource: logSource,
      resource: location.href,
      logLevel: logLevel,
    });
    await logEntry.save();
  };
  
  return false;
}

export default {
  initialize
};
