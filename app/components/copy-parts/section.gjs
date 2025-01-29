import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { trackedReset } from 'tracked-toolbox';
import DownloadButton from './download-button';
import { inject as service } from '@ember/service';
import { concat } from '@ember/helper';
import update from 'frontend-gelinkt-notuleren/utils/copy-parts-update';

function getDestinationElement(content) {
  return document.getElementById(content.replaceId);
}

export default class Section extends Component {
  @service intl;
  @trackedReset({
    memo: 'section.content',
    update,
  })
  content = update(
    this.args.section.content,
    this.args.section.level + 1,
    this.intl,
  );
  <template>
    <div class='gn-meeting-copy--section-container'>
      <div class='gn-meeting-copy--structure'>
        <div class='gn-meeting-copy--structure-header'>
          {{@section.label}}
        </div>
        <div class='gn-meeting-copy--structure-content'>
          {{htmlSafe this.content.html}}

          {{#each this.content.sections as |content|}}
            {{#in-element (getDestinationElement content)}}
              <Section @section={{content}} />
            {{/in-element}}
          {{/each}}
        </div>
      </div>
      <div
        class='gn-meeting-copy--section-button'
        style={{htmlSafe (concat 'right: -' @section.level 'rem')}}
      >
        <DownloadButton
          @section={{@section}}
          @translatedLabel={{@section.label}}
        />
      </div>
    </div>
  </template>
}
