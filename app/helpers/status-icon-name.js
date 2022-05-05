import { helper } from '@ember/component/helper';

export default helper(function statusIconName([status] /*, named*/) {
  if (status === 'concept') return 'pencil';
  if (status === 'firstSignature' || status === 'secondSignature')
    return 'message';
  if (status === 'published') return 'check';

  return 'pencil';
});
