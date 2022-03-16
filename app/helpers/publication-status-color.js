import { helper } from '@ember/component/helper';

export default helper(function publicationStatusColor([status] /*, named*/) {
  if (status === 'published') return 'action';
  if (status === 'firstSignature') return 'warning';
  if (status === 'secondSignature') return 'success';
  return null;
});
