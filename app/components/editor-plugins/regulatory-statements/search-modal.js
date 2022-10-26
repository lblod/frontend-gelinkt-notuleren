import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { query } from 'ember-data-resources';
import { EDITOR_FOLDERS } from '../../../config/constants';

export default class RegulatoryStatementsSearchModalComponent extends Component {
  @tracked searchQuery;
  @tracked selectedReglement;

  regulatoryStatements = query(this, 'document-container', () => ({
    include: 'status,current-version',
    'filter[folder][:id:]': EDITOR_FOLDERS.REGULATORY_STATEMENTS,
  }));
  @action
  selectReglement(reglement) {
    this.selectedReglement = reglement;
  }
}
