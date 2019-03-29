import { helper } from '@ember/component/helper';

export function behandelingSubject([body]/*, hash*/) {
  if (body) {
    const div = document.createElement('div');
    div.innerHTML = body;

    const subjectNode = div.querySelector("[property='dc:subject']");
    if (subjectNode)
      return subjectNode.textContent.trim();
  }
  return null;
}

export default helper(behandelingSubject);
