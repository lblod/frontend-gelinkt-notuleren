import { helper } from '@ember/component/helper';
import lightFormat from 'date-fns/lightFormat';

export default helper(function detailedDate([datetime]/*, hash*/) {
  //If not a date (e.g. date is undefined) return "" for printing on screen.
  if (!(datetime instanceof Date)) return "";

  try {
    return lightFormat(datetime, 'dd/MM/yyyy HH:mm');
  }
  catch(e) {
    console.error(e);
    return "";
  }
});
