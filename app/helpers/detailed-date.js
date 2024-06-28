import { helper } from '@ember/component/helper';
import { detailedDate as detailedDateUtil } from '../utils/detailed-date';

export default helper(function detailedDate([datetime] /*, hash*/) {
  return detailedDateUtil(datetime);
});
