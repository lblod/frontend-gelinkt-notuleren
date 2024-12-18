import Component from '@glimmer/component';
import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';
import t from 'ember-intl/helpers/t';
import { trackedReset } from 'tracked-toolbox';
import { stripHtmlForPublish } from '@lblod/ember-rdfa-editor/utils/strip-html-for-publish';
import DownloadButton from './copy-parts/download-button';

function update(component) {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(
    stripHtmlForPublish(component.args.decision.content),
    'text/html',
  );
  const temporaryRenderingSpace = document.createElement('div');
  document.firstElementChild.appendChild(temporaryRenderingSpace);
  const mappedSections = SECTIONS.flatMap(
    ({ label, selector, callback = (a) => a }) => {
      const elements = Array.from(parsed.querySelectorAll(selector));
      return elements.map((element) => {
        const contentElement = callback(element);
        // Note, it's important to generate the content here as with the use of DOM apis in the
        // callbacks, it's easy to accidentally mutate `contentElement`. For example when appending
        // parts of the content to a 'container' element.
        const contentHtml = contentElement.outerHTML;
        return {
          label,
          content: contentHtml,
        };
      });
    },
  );
  temporaryRenderingSpace.remove();

  return mappedSections;
}

const generateSections = helper((childTypes) => {
  if (childTypes) {
    const sections = {};
    childTypes.forEach((type) => {
      sections[type] = SECTIONS[type];
    });
    return sections;
  }
});

export default class Section extends Component {
  @trackedReset({
    memo: 'decision.content',
    update,
  })
  sections = update(this);

  <template>
    <div class='au-o-flow--small au-u-3-5'>
      {{#each this.sections as |section|}}
        <Section
          @section={{section}}
          @sections={{generateSections section.childTypes}}
        />
      {{/each}}
    </div>
  </template>
}
