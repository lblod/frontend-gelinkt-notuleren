import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import t from 'ember-intl/helpers/t';
import { trackedReset } from 'tracked-toolbox';
import { stripHtmlForPublish } from '@lblod/ember-rdfa-editor/utils/strip-html-for-publish';
import DownloadButton from './copy-parts/download-button';
import Section from './copy-parts/section';
import { helper } from '@ember/component/helper';

const SECTIONS = {
  title: {
    label: 'copy-options.section.title',
    selector:
      '[typeof="say:Title"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Title"]>[data-content-container="true"]',
    childTypes: ['chapter'],
  },
  chapter: {
    label: 'copy-options.section.title',
    selector:
      '[typeof="say:Chapter"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Chapter"]>[data-content-container="true"]',
    childTypes: ['section'],
  },
  section: {
    label: 'copy-options.section.title',
    selector:
      '[typeof="say:Section"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Section"]>[data-content-container="true"]',
    childTypes: ['subsection'],
  },
  subsection: {
    label: 'copy-options.section.title',
    selector:
      '[typeof="say:Subsection"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Subsection"]>[data-content-container="true"]',
    childTypes: ['article'],
  },
  article: {
    label: 'copy-options.section.title',
    selector:
      '[typeof="say:Article"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Article"]>[data-content-container="true"]',
    childTypes: ['paragraph'],
  },
  paragraph: {
    label: 'copy-options.section.title',
    selector:
      '[typeof="say:Paragraph"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Paragraph"]>[data-content-container="true"]',
  },
};

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

export default class DecisionCopyParts extends Component {
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
