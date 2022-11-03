import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { query } from 'ember-data-resources';
import { EDITOR_FOLDERS } from '../../../config/constants';
import { inject as service } from '@ember/service';

export default class RegulatoryStatementsSearchModalComponent extends Component {
  @service store;

  @tracked searchValue = '';
  @tracked _selectedStatement;
  debounceTime = 2000;

  regulatoryStatements = query(this, 'document-container', () => ({
    include: 'current-version',
    'filter[folder][:id:]': EDITOR_FOLDERS.REGULATORY_STATEMENTS,
    'filter[:has-no:is-part-of]': 'yes',
    ...(this.searchValue && {
      'filter[current-version][title]': this.searchValue,
    }),
  }));

  updateFilter(event) {
    const input = event.target.value;
    this.searchValue = input;
    this._selectedStatement = null;
  }

  @action
  selectStatement(statement) {
    this._selectedStatement = statement;
  }

  get selectedStatement() {
    return (
      this._selectedStatement ?? this.regulatoryStatements.records?.firstObject
    );
  }
}
