import { stripHtmlForPublish } from '@lblod/ember-rdfa-editor/utils/strip-html-for-publish';
import SECTIONS from 'frontend-gelinkt-notuleren/utils/rb-sections';
import { v4 as uuid } from 'uuid';

// In the future we should rely on the prosemirror nodespecs instead of the dom targeting we are doing
export default function update(sectionContent, level, intl) {
  const parser = new DOMParser();
  let parsed = parser.parseFromString(
    stripHtmlForPublish(sectionContent),
    'text/html',
  );
  const mappedSections = SECTIONS.flatMap(
    ({
      label,
      labelCallback,
      labelSelector,
      selector,
      childTypes,
      contentCallback,
      contentSelector,
    }) => {
      const elements = Array.from(parsed.querySelectorAll(selector));
      return elements.map((element) => {
        let contentElement;
        if (contentCallback) {
          contentElement = contentCallback(element);
        } else if (contentSelector) {
          contentElement = element.querySelector(contentSelector);
        } else {
          contentElement = element;
        }
        let elementLabel;
        if (label) {
          elementLabel = intl.t(label);
        } else if (labelCallback) {
          elementLabel = labelCallback(element);
        } else if (labelSelector) {
          elementLabel = element.querySelector(labelSelector).innerText;
        }
        // Note, it's important to generate the content here as with the use of DOM apis in the
        // callbacks, it's easy to accidentally mutate `contentElement`. For example when appending
        // parts of the content to a 'container' element.
        // We replace the content by this key in order to know where to split the content, and where to render the different sections
        const replaceId = `say-rb-copy-replace-by-${uuid()}`;
        const div = document.createElement('div');
        div.setAttribute('id', replaceId);
        element.parentNode.replaceChild(div, element);

        const contentHtml = contentElement.outerHTML;
        return {
          label: elementLabel,
          content: contentHtml,
          childTypes,
          isSection: true,
          level: level,
          replaceId,
        };
      });
    },
  );
  let outerHTML = parsed.firstElementChild.outerHTML;
  outerHTML = outerHTML.replace('<html><head></head><body>', '');
  outerHTML = outerHTML.replace('</body></html>', '');
  return { html: outerHTML, sections: mappedSections };
}
