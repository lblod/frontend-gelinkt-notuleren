import Component from '@glimmer/component';
import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';
import t from 'ember-intl/helpers/t';
import { trackedReset } from 'tracked-toolbox';
import { stripHtmlForPublish } from '@lblod/ember-rdfa-editor/utils/strip-html-for-publish';
import DownloadButton from './download-button';
import SECTIONS from 'frontend-gelinkt-notuleren/utils/rb-sections';

function update(component) {
  if (!component.args.sections) return [component.args.section.content];
  const parser = new DOMParser();
  const parsed = parser.parseFromString(
    stripHtmlForPublish(component.args.section.content),
    'text/html',
  );
  const mappedSections = component.args.sections.flatMap(
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
          level: component.args.section.level + 1,
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

export default class Section extends Component {
  @trackedReset({
    memo: 'section.content',
    update,
  })
  content = update(this);

  <template>
    <div class='gn-meeting-copy--section-container'>
      <div class='gn-meeting-copy--structure'>
        <div class='gn-meeting-copy--structure-header'>
          {{t @section.label}}
        </div>
        <div class='gn-meeting-copy--structure-content'>
          {{#each this.content as |content|}}
            {{#if content.isSection}}
              <Section
                @section={{content}}
                @sections={{generateSections content.childTypes}}
              />
            {{else}}

              {{htmlSafe content}}

            {{/if}}
          {{/each}}
        </div>
      </div>
      <div
        class='gn-meeting-copy--section-button'
        style='right: -{{htmlSafe @section.level}}rem'
      >
        <DownloadButton @section={{@section}} />
      </div>
    </div>
  </template>
}
