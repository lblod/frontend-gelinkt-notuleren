import Component from '@glimmer/component';
import { tracked } from 'tracked-built-ins';
import { action } from '@ember/object';
import { EDITOR_FOLDERS } from '../../../config/constants';
import { inject as service } from '@ember/service';
import { restartableTask } from 'ember-concurrency';

export default class RegulatoryStatementsSearchModalComponent extends Component {
  @service store;
  @service documentService;

  @tracked page = 0;
  @tracked pageSize = 10;

  @tracked searchValue = '';
  @tracked _selectedStatement;

  @tracked showLoadMore = true;

  @tracked regulatoryStatements = tracked([]);
  @tracked includedStatements = [];
  @tracked debounceTime = 2000;

  @action
  didInsert() {
    this.fetchNextPage.perform();
    const editorDocument = this.store.createRecord('editor-document', {
      content: this.args.controller.htmlContent ?? '',
    });
    this.includedStatements =
      this.documentService.getDocumentparts(editorDocument);
  }

  fetchNextPage = restartableTask(async () => {
    const regulatoryStatements = await this.store.query('document-container', {
      include: 'current-version',
      'filter[folder][:id:]': EDITOR_FOLDERS.REGULATORY_STATEMENTS,
      ...(this.searchValue && {
        'filter[current-version][title]': this.searchValue,
      }),
      page: {
        size: this.pageSize,
        number: this.page,
      },
      sort: ':no-case:current-version.title',
    });
    this.regulatoryStatements.push(...regulatoryStatements.toArray());
    if (regulatoryStatements.meta.count <= this.regulatoryStatements.length) {
      this.showLoadMore = false;
    } else {
      this.showLoadMore = true;
      this.page += 1;
    }
  });

  updateFilter = restartableTask(async (event) => {
    const input = event.target.value;
    this.searchValue = input;
    this.regulatoryStatements = tracked([]);
    this._selectedStatement = null;
    this.page = 0;
    await this.fetchNextPage.perform();
  });

  @action
  selectStatement(statement) {
    this._selectedStatement = statement;
  }

  get selectedStatement() {
    return this._selectedStatement ?? this.regulatoryStatements?.firstObject;
  }

  isInserted = (statement) => this.includedStatements.includes(statement.uri);
}
