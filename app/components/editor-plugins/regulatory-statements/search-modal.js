import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { query } from 'ember-data-resources';
import { EDITOR_FOLDERS } from '../../../config/constants';

export default class RegulatoryStatementsSearchModalComponent extends Component {
  @tracked searchQuery;
  @tracked selectedStatement;

  regulatoryStatements = query(this, 'document-container', () => ({
    include: 'current-version',
    'filter[folder][:id:]': EDITOR_FOLDERS.REGULATORY_STATEMENTS,
    ...(this.searchQuery && {
      'filter[current-version][title]': this.searchQuery,
    }),
  }));

  @action
  selectStatement(statement) {
    this.selectedStatement = statement;
  }
}
