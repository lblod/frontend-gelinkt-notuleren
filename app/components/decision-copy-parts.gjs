import Component from '@glimmer/component';
import { service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import { on } from '@ember/modifier';
import { task } from 'ember-concurrency';
import perform from 'ember-concurrency/helpers/perform';
import t from 'ember-intl/helpers/t';
import { trackedReset } from 'tracked-toolbox';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';

class DownloadButton extends Component {
  @service intl;

  get isSuccess() {
    return this.copyToClipboard.last?.isSuccessful;
  }
  get icon() {
    return this.isSuccess ? 'circle-check' : undefined;
  }
  get label() {
    return this.args.translatedLabel ?? this.intl.t(this.args.section.label);
  }

  copyToClipboard = task(async () => {
    await navigator.clipboard.write([
      new ClipboardItem({ 'text/html': this.args.section.content.trim() }),
    ]);
  });

  <template>
    <AuButton
      @skin='link'
      @icon={{this.icon}}
      @loading={{this.copyToClipboard.isRunning}}
      @loadingMessage={{t 'copy-options.copying'}}
      class={{if this.isSuccess 'download-meeting-part-downloaded'}}
      {{on 'click' (perform this.copyToClipboard)}}
      ...attributes
    >
      {{#if this.isSuccess}}
        {{t 'copy-options.part-copied' part=this.label}}
      {{else}}
        {{t 'copy-options.copy-part' part=this.label}}
      {{/if}}
    </AuButton>
  </template>
}

const SECTIONS = [
  {
    label: 'copy-options.section.title',
    selector:
      '[property="http://data.europa.eu/eli/ontology#title"]>[data-content-container="true"]',
  },
  {
    label: 'copy-options.section.description',
    selector:
      '[property="http://data.europa.eu/eli/ontology#description"]>[data-content-container="true"]',
  },
  {
    label: 'copy-options.section.motivation',
    selector:
      '[property="http://data.vlaanderen.be/ns/besluit#motivering"]>[data-content-container="true"]',
    parts: {
      selector: ':scope h5',
      callback: (sectionHeading) => {
        const wrapper = document.createElement('div');
        const sectionContents = [];
        let next = sectionHeading.nextElementSibling;
        while (next && next.tagName !== 'H5') {
          sectionContents.push(next);
          next = next.nextElementSibling;
        }
        wrapper.append(...sectionContents);
        return wrapper;
      },
      labelCallback: (sectionHeading) => sectionHeading,
    },
  },
  {
    label: 'copy-options.section.ruling',
    selector:
      ':scope [about^="http://data.lblod.info/id/besluiten/"][property="http://www.w3.org/ns/prov#value"]>[data-content-container="true"]',
    parts: {
      selector:
        '[property="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"][resource="http://data.vlaanderen.be/ns/besluit#Artikel"]',
      callback: (selected) => selected.parentElement?.parentElement,
      labelSelector: ':scope h5',
      contentSelector: ':scope [data-say-structure-content=true]',
    },
  },
];

function htmlSafer(text) {
  return htmlSafe(text);
}

// This method of looking for query selectors is error-prone as it assumes that the document follows
// the current DOM output specs. This is not necessarily true of historic or future documents. It
// would be better to either use an RDFa parser that can also return the elements associated with
// relations or a headless prosemirror instance.
function update(component) {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(
    component.args.decision.content,
    'text/html',
  );
  return SECTIONS.flatMap(({ label, selector, parts, callback = (a) => a }) => {
    const elements = Array.from(parsed.querySelectorAll(selector));
    return elements.map((element) => {
      const contentElement = callback(element);
      let foundParts = [];
      if (parts) {
        const partCb = parts.callback || ((a) => a);
        const partElements =
          contentElement.querySelectorAll(parts.selector) ?? [];
        partElements.forEach((part) => {
          const partElement = partCb(part);
          const partLabel = parts.labelCallback
            ? parts.labelCallback(part)
            : partElement.querySelector(parts.labelSelector);
          const partContent = parts.contentSelector
            ? partElement.querySelector(parts.contentSelector).outerHTML
            : partElement.outerHTML;
          foundParts.push({
            translatedLabel: partLabel.textContent,
            content: partContent,
          });
        });
      }
      return {
        label,
        content: contentElement.outerHTML,
        parts: foundParts,
      };
    });
  });
}

export default class DecisionCopyParts extends Component {
  @trackedReset({
    memo: 'decision.content',
    update,
  })
  sections = update(this);

  <template>
    <div class='au-o-flow--small au-u-3-5'>
      {{#each this.sections as |section|}}
        <div class='gn-meeting-copy--section-container'>
          <div class='gn-meeting-copy--structure'>
            <div class='gn-meeting-copy--structure-header'>
              {{t section.label}}
            </div>
            {{#each section.parts as |part|}}
              <div class='gn-meeting-copy--structure-content'>
                <div class='gn-meeting-copy--section-container'>
                  <div class='gn-meeting-copy--structure'>
                    <div class='gn-meeting-copy--structure-header'>
                      {{part.translatedLabel}}
                    </div>
                    <div class='gn-meeting-copy--structure-content'>
                      {{(htmlSafer part.content)}}
                    </div>
                  </div>
                  <div class='gn-meeting-copy--section-button'>
                    <DownloadButton @section={{part}} @translatedLabel={{part.translatedLabel}} />
                  </div>
                </div>
              </div>
            {{else}}
              <div class='gn-meeting-copy--structure-content'>
                {{(htmlSafer section.content)}}
              </div>
            {{/each}}
          </div>
          <div class='gn-meeting-copy--section-button'>
            <DownloadButton @section={{section}} />
          </div>
        </div>
      {{/each}}
    </div>
  </template>
}