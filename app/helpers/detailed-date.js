import { helper } from '@ember/component/helper';
import lightFormat from 'date-fns/lightFormat';

export default helper(function detailedDate([datetime]/*, hash*/) {
  try {
    return lightFormat(datetime, 'dd/MM/yyyy HH:mm');
  }
  catch(e) {
    console.error(e);
    return "";
  }
});
