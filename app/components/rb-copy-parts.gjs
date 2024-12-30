import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { trackedReset } from 'tracked-toolbox';
import { stripHtmlForPublish } from '@lblod/ember-rdfa-editor/utils/strip-html-for-publish';
import Section from './copy-parts/section';
import { helper } from '@ember/component/helper';
import SECTIONS from 'frontend-gelinkt-notuleren/utils/rb-sections';

// This method of looking for query selectors is error-prone as it assumes that the document follows
// the current DOM output specs. This is not necessarily true of historic or future documents. It
// would be better to either use an RDFa parser that can also return the elements associated with
// relations or a headless prosemirror instance.
function update(component) {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(
    stripHtmlForPublish(component.args.decision.content),
    'text/html',
  );
  const mappedSections = SECTIONS.flatMap(
    ({ label, selector, childTypes, callback = (a) => a }) => {
      const elements = Array.from(parsed.querySelectorAll(selector));
      return elements.map((element) => {
        const contentElement = callback(element);
        // Note, it's important to generate the content here as with the use of DOM apis in the
        // callbacks, it's easy to accidentally mutate `contentElement`. For example when appending
        // parts of the content to a 'container' element.
        element.parentNode.replaceChild(
          document.createTextNode(`say-rb-copy-replace-by`),
          element,
        );
        const contentHtml = contentElement.outerHTML;
        return {
          label,
          content: contentHtml,
          childTypes,
          isSection: true,
          level: 0,
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

const generateSections = helper(([childTypes]) => {
  if (childTypes) {
    const sections = [];
    childTypes.forEach((type) => {
      const sectionType = SECTIONS.find((section) => section.id === type);
      if (sectionType) {
        sections.push(sectionType);
      }
    });
    return sections;
  }
});

export default class DecisionCopyParts extends Component {
  @trackedReset({
    memo: 'decision.content',
    update,
  })
  content = update(this);

  <template>
    <div class='au-o-flow--small au-u-3-5'>
      <div class='gn-meeting-copy--section-container'>
        {{#each this.content as |content|}}
          {{#if content.isSection}}
            <Section
              @section={{content}}
              @sections={{generateSections content.childTypes}}
            />
          {{else}}
            <div class='gn-meeting-copy--structure-content'>
              {{htmlSafe content}}
            </div>
          {{/if}}
        {{/each}}
      </div>
    </div>
  </template>
}
