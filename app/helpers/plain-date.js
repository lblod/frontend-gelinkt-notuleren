import { helper } from '@ember/component/helper';

export default helper(function plainDate([datetime]/*, hash*/) {
  //If not a date (e.g. date is undefined) return "" for printing on screen.
  if (!(datetime instanceof Date)) return "";

  try {
    return Intl.DateTimeFormat("nl-BE", { dateStyle: "short" }).format(datetime);
  }
  catch(e) {
    console.error(e);
    return "";
  }
});
