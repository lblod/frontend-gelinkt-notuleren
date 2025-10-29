import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from 'tracked-built-ins';
import t from 'ember-intl/helpers/t';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import type { SayController } from '@lblod/ember-rdfa-editor';
import ArWidgetContents from './widget-contents';

type Sig = {
  Args: {
    controller: SayController;
  };
  Element: HTMLLIElement;
};

export default class ArImporterSidebarWidget extends Component<Sig> {
  @tracked modalOpen = true;
  openModal = () => {
    this.modalOpen = true;
  };
  closeModal = () => {
    this.modalOpen = false;
  };

  <template>
    <li class='au-c-list__item' ...attributes>
      <AuButton
        @icon='add'
        @iconAlignment='left'
        @skin='link'
        {{on 'click' this.openModal}}
      >
        {{t 'ar-importer.sidebar-widget.label'}}
      </AuButton>
    </li>
    <AuModal
      @size='large'
      @modalOpen={{this.modalOpen}}
      @closeModal={{this.closeModal}}
      @title={{t 'ar-importer.modal.title'}}
      @padding='none'
      as |modal|
    >
      <modal.Body>
        <ArWidgetContents
          @controller={{@controller}}
          @onInsert={{this.closeModal}}
        />
      </modal.Body>
    </AuModal>
  </template>
}
