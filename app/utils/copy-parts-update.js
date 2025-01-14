import { stripHtmlForPublish } from '@lblod/ember-rdfa-editor/utils/strip-html-for-publish';
import SECTIONS from 'frontend-gelinkt-notuleren/utils/rb-sections';

// In the future we should rely on the prosemirror nodespecs instead of the dom targeting we are doing
export default function update(sectionContent, level, intl) {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(
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
        element.parentNode.replaceChild(
          document.createTextNode(`say-rb-copy-replace-by`),
          element,
        );

        const contentHtml = contentElement.outerHTML;
        return {
          label: elementLabel,
          content: contentHtml,
          childTypes,
          isSection: true,
          level: level,
        };
      });
    },
  );

  const outerHTML = parsed.firstElementChild.outerHTML.split(
    'say-rb-copy-replace-by',
  );
  const content = [];
  for (let i = 0; i < outerHTML.length; i++) {
    content.push(outerHTML[i]);
    if (mappedSections[i]) {
      content.push(mappedSections[i]);
    }
  }
  return content;
}
