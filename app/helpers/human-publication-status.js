import { helper } from '@ember/component/helper';

export default helper(function humanPublicationStatus([status] /*, named*/) {
  if (status === 'published') return 'Gepubliceerd';
  else if (status === 'firstSignature') return 'Eerste ondertekening verkregen';
  else if (status === 'secondSignature') return 'Getekend';
  else return 'Concept';
});
