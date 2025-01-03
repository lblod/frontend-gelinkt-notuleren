import Component from '@glimmer/component';
import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';
import t from 'ember-intl/helpers/t';
import { trackedReset } from 'tracked-toolbox';
import { stripHtmlForPublish } from '@lblod/ember-rdfa-editor/utils/strip-html-for-publish';
import DownloadButton from './download-button';
import SECTIONS from 'frontend-gelinkt-notuleren/utils/rb-sections';
import { inject as service } from '@ember/service';

function update(component, intl) {
  if (!component.args.sections) return [component.args.section.content];
  const parser = new DOMParser();
  const parsed = parser.parseFromString(
    stripHtmlForPublish(component.args.section.content),
    'text/html',
  );
  const mappedSections = component.args.sections.flatMap(
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
    const sections = SECTIONS.filter((section) =>
      childTypes.includes(section.id),
    );
    return sections;
  }
});

export default class Section extends Component {
  @service intl;
  @trackedReset({
    memo: 'section.content',
    update,
  })
  content = update(this, this.intl);

  <template>
    <div class='gn-meeting-copy--section-container'>
      <div class='gn-meeting-copy--structure'>
        <div class='gn-meeting-copy--structure-header'>
          {{@section.label}}
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
        <DownloadButton
          @section={{@section}}
          @translatedLabel={{@section.label}}
        />
      </div>
    </div>
  </template>
}
