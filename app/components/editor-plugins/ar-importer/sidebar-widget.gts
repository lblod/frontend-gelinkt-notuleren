import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from 'tracked-built-ins';
import t from 'ember-intl/helpers/t';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import type { SayController } from '@lblod/ember-rdfa-editor';
import ArImporterModal from './modal';

type Sig = {
  Args: {
    controller: SayController;
  };
};

export default class ArImporterSidebarWidget extends Component<Sig> {
  @tracked modalOpen = false;

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
      <ArImporterModal
        @controller={{@controller}}
        @isModalOpen={{this.modalOpen}}
        @closeModal={{this.closeModal}}
      />
    {{/if}}
  </template>
}
