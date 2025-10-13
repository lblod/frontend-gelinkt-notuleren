import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import ArImporterModal from './modal';
import { tracked } from 'tracked-built-ins';
import t from 'ember-intl/helpers/t';

export default class ArImporterSidebarWidget extends Component {
  @tracked modalOpen = true;

  insertDesign = () => {};

  openModal = () => {
    this.modalOpen = true;
  };

  closeModal = () => {
    this.modalOpen = false;
  };

  <template>
    <li class='au-c-list__item'>
      <AuButton
        @icon='add'
        @iconAlignment='left'
        @skin='link'
        {{on 'click' this.openModal}}
      >
        {{t 'ar-importer.sidebar-widget.label'}}
      </AuButton>
    </li>
    {{#if this.modalOpen}}
      <ArImporterModal />
    {{/if}}
  </template>
}
