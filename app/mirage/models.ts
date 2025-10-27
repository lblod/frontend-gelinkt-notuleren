import type { Variable } from 'frontend-gelinkt-notuleren/models/measure-concept';
import { belongsTo, hasMany, Model } from 'miragejs';
import type { BelongsTo, HasMany } from 'miragejs/-types';

export type ArDesign = {
  uri: string;
  name: string;
  date: string;
  measures: HasMany<'measure'>;
};
export type Measure = {
  rawTemplateString: string;
  templateString: string;
  design: BelongsTo<'ar-design'>;
  variables: Variable[];
};

export default {
  arDesign: Model.extend<Partial<ArDesign>>({
    measures: hasMany('measure'),
  }),
  measure: Model.extend<Partial<Measure>>({
    design: belongsTo('ar-design'),
  }),
};
