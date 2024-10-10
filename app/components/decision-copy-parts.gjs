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
  get isSuccess() {
    return this.copyToClipboard.last?.isSuccessful;
  }
  get icon() {
    return this.isSuccess ? 'circle-check' : undefined;
  }

  copyToClipboard = task(async () => {
    await navigator.clipboard.writeText(this.args.section.content.trim());
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
        {{t 'copy-options.part-copied' part=(t @section.label)}}
      {{else}}
        {{t 'copy-options.copy-part' part=(t @section.label)}}
      {{/if}}
    </AuButton>
  </template>
}

const SECTIONS = [
  {
    label: 'copy-options.section.title',
    selector: '[property="http://data.europa.eu/eli/ontology#title"]',
  },
  {
    label: 'copy-options.section.description',
    selector: '[property="http://data.europa.eu/eli/ontology#description"]',
  },
  {
    label: 'copy-options.section.motivation',
    selector: '[property="http://data.vlaanderen.be/ns/besluit#motivering"]',
  },
  {
    label: 'copy-options.section.ruling',
    selector:
      '[property="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"][resource="http://data.vlaanderen.be/ns/besluit#Artikel"]',
    callback: (selected) => selected.parentElement?.parentElement,
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
  console.warn('content processing!');
  const parser = new DOMParser();
  const parsed = parser.parseFromString(
    component.args.decision.content,
    'text/html',
  );
  return SECTIONS.flatMap(({ label, selector, callback = (a) => a }) => {
    const elements = Array.from(parsed.querySelectorAll(selector));
    return elements.map((element) => ({
      label,
      content: callback(element).outerHTML,
    }));
  });
}

export default class DecisionCopyParts extends Component {
  @service intl;

  @trackedReset({
    memo: 'decision.content',
    update,
  })
  sections = update(this);

  <template>
    <div class='au-o-flow--small'>
      {{#each this.sections as |section|}}
        <div class='au-u-flex'>
          <div class='say-structure'>
            <div class='say-structure__header'>
              {{t section.label}}
            </div>
            <div class='say-structure__content'>
              {{(htmlSafer section.content)}}
            </div>
          </div>
          <DownloadButton @section={{section}} />
        </div>
      {{/each}}
    </div>
  </template>
}
