import { helper } from '@ember/component/helper';
import formatRelative from 'date-fns/formatRelative';
import { nl } from 'date-fns/locale';

// this is a helper to mimic the moment-calendar behaviour
export default helper(function humanFriendlyDate([referenceDatetime]/*, hash*/) {
  try {
    return formatRelative(referenceDatetime, new Date(), { locale: nl });
  }
  catch(e) {
    console.error(e);
    return "";
  }
});
