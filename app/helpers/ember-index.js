import { helper } from '@ember/component/helper';

export default helper(function emberIndex([agendapunten, agendapunt]/*, hash*/) {
  return agendapunten.indexOf(agendapunt);
});
