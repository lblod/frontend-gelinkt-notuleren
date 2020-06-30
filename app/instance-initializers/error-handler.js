import Ember from 'ember';

export function initialize(appInstance) {
  const store = appInstance.lookup('service:store');
  console.log('Error handler initialized')
  window.onerror = function (msg, url, lineNo, columnNo, error) {
    var string = msg.toLowerCase();
    var substring = "script error";
    if (string.indexOf(substring) > -1){
      alert('Script Error: See Browser Console for Detail');
    } else {
      var message = [
        'Message: ' + msg,
        'URL: ' + url,
        'Line: ' + lineNo,
        'Column: ' + columnNo,
        'Error object: ' + JSON.stringify(error)
      ].join(' - ');
      


      console.log('Error logged on the initializer');
      console.log(message);
      
      const logEntry = store.createRecord('log-entry', {
        message: msg
      });
      console.log(logEntry);
    }
  
    return false;
  };
}

export default {
  initialize
};
