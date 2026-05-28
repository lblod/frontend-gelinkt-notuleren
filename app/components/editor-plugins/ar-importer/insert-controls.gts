import { fn } from '@ember/helper';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import { PlusIcon } from '@appuniversum/ember-appuniversum/components/icons/plus';
import type { TOC } from '@ember/component/template-only';
import type ArDesign from 'frontend-gelinkt-notuleren/models/ar-design';
import t from 'ember-intl/helpers/t';
import PowerSelect, {
  type Select,
} from 'ember-power-select/components/power-select';
import Component from '@glimmer/component';
import { service } from '@ember/service';
import type IntlService from 'ember-intl/services/intl';
import type {
  ArInsertFunc,
  ArticlePosition,
  InsertPositionOption,
} from './common-types';

const InsertButton: TOC<{
  Args: {
    arDesign: ArDesign;
    insertLoading?: boolean;
    onInsertAr: ArInsertFunc;
    insertPos: ArticlePosition | null;
  };
}> = <template>
  <AuButton
    @icon={{PlusIcon}}
    @loading={{@insertLoading}}
    @loadingMessage={{t 'application.loading'}}
    {{on 'click' (fn @onInsertAr @arDesign @insertPos true)}}
  >{{t 'ar-importer.controls.insert'}}</AuButton>
</template>;

const InsertPositionSelector: TOC<{
  Args: {
    options: InsertPositionOption[];
    selected: InsertPositionOption | null;
    onChange: (
      selected: InsertPositionOption,
      select: Select,
      event?: Event,
    ) => void;
  };
}> = <template>
  <PowerSelect
    class='au-u-1-5'
    @allowClear={{false}}
    @onChange={{@onChange}}
    @selected={{@selected}}
    @options={{@options}}
    as |option|
  >{{option.label}}</PowerSelect>
</template>;

export interface ArInsertControlArgs {
  arDesign: ArDesign;
  onInsertAr: ArInsertFunc;
  insertLoading?: boolean;
  articles: ArticlePosition[];
}
type Sig = {
  Args: ArInsertControlArgs;
};

export class InsertControls extends Component<Sig> {
  @tracked _selected: InsertPositionOption | null = null;
  @service declare intl: IntlService;

  get beforeFirst(): InsertPositionOption {
    return {
      value: 'first',
      label: this.intl.t('ar-importer.controls.first'),
    };
  }
  get afterLast(): InsertPositionOption {
    return { value: 'last', label: this.intl.t('ar-importer.controls.last') };
  }

  get articleOptions(): InsertPositionOption[] {
    return this.args.articles.map((articlePos, i) => ({
      value: articlePos,
      label: this.intl.t('ar-importer.controls.after-article-x', {
        articleNumber: i + 1,
      }),
    }));
  }

  get options(): InsertPositionOption[] {
    return [this.afterLast, this.beforeFirst, ...this.articleOptions];
  }

  get selected(): InsertPositionOption {
    return this._selected ?? this.afterLast;
  }

  setSelected = (val: InsertPositionOption | null) => {
    this._selected = val;
  };

  get insertPos(): ArticlePosition | null {
    if (this.selected.value === 'last' || this.args.articles.length == 0) {
      return null;
    } else if (this.selected.value === 'first') {
      return this.args.articles[0] ?? null;
    } else {
      return this.selected.value;
    }
  }

  <template>
    <InsertPositionSelector
      @options={{this.options}}
      @selected={{this.selected}}
      @onChange={{this.setSelected}}
    />
    <InsertButton
      @arDesign={{@arDesign}}
      @onInsertAr={{@onInsertAr}}
      @insertLoading={{@insertLoading}}
      @insertPos={{this.insertPos}}
    />
  </template>
}
