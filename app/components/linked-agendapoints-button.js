import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { query } from 'ember-data-resources';
import { action } from '@ember/object';

export default class LinkedAgendapointsButton extends Component {
  @tracked modalOpen = false;

  agendapoints = query(this, 'document-container', () => ({
    include: 'current-version,current-version.parts',
    'filter[current-version][parts][:id:]': this.args.document.id,
    fields: {
      'document-containers': '',
      'editor-documents': '',
    },
  }));

  @action
  openModal() {
    this.modalOpen = true;
  }

  @action
  closeModal() {
    this.modalOpen = false;
  }
}
