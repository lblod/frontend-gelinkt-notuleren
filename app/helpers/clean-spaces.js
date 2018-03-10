import { helper } from '@ember/component/helper';

const whitespaceRegex = new RegExp(String.fromCharCode(160), 'g'); // &nbsp;

export function cleanSpaces([value]/*, hash*/) {
  if (value) {
    return value.replace(whitespaceRegex, ' ');
  }
  return value;
}

export default helper(cleanSpaces);
