import { helper } from '@ember/component/helper';
import lightFormat from 'date-fns/lightFormat';

export default helper(function plainDate([datetime]/*, hash*/) {
  try {
    return lightFormat(datetime, 'dd/MM/yyyy');
  }
  catch(e){
    console.error(e);
    return "";
  }
});
