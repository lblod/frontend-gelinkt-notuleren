import Component from '@glimmer/component';
import { query } from 'ember-data-resources';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class LinkedAgendapointsModal extends Component {
  @tracked
  pageSize = 10;
  @tracked
  page = 0;
  @tracked
  sort = '';
  @service intl;

  agendapoints = query(this, 'document-container', () => ({
    include: 'current-version,current-version.parts',
    'filter[current-version][parts][:id:]': this.args.document.id,
    sort: this.sort,
    page: {
      number: this.page,
      size: this.pageSize,
    },
  }));
}
