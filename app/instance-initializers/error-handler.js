export function initialize(appInstance) {
  const store = appInstance.lookup('service:store');
  window.onerror = async function (msg, url, lineNo, columnNo, error) {
    const logSource = await store.query('log-source', {
      filter: {
        id: 'F400FB90-81F6-4F49-B4F5-CDFAD0DA1243'
      }
    });
    const logLevel = await store.query('log-level', {
      filter: {
        id: '3af9ebe1-e6a8-495c-a392-16ced1f38ef1'
      }
    });
    const logEntry = store.createRecord('log-entry', {
      message: msg,
      specificInformation: error.stack,
      datetime: new Date(),
      logSource: logSource.get('firstObject'),
      resource: location.href,
      logLevel: logLevel.get('firstObject'),
    });
    await logEntry.save();
  };
  
    return false;
}

export default {
  initialize
};
