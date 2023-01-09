import { helper } from '@ember/component/helper';

export default helper(function limitContent([text, limit] /*, named*/) {
  if (!text) return '';
  if (text.length < limit) {
    return text;
  } else {
    return text.slice(0, limit) + '...';
  }
});
