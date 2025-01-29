import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { trackedReset } from 'tracked-toolbox';
import Section from './copy-parts/section';
import { inject as service } from '@ember/service';
import update from 'frontend-gelinkt-notuleren/utils/copy-parts-update';

function getDestinationElement(content) {
  return document.getElementById(content.replaceId);
}

export default class DecisionCopyParts extends Component {
  @service intl;
  @trackedReset({
    memo: 'decision.content',
    update,
  })
  content = update(this.args.decision.content, 0, this.intl);

  <template>
    <div class='au-o-flow--small au-u-3-5'>
      <div class='gn-meeting-copy--section-container'>
        {{htmlSafe this.content.html}}
        {{#each this.content.sections as |content|}}
          {{#in-element (getDestinationElement content)}}
            <Section @section={{content}} />
          {{/in-element}}
        {{/each}}
      </div>
    </div>
  </template>
}
