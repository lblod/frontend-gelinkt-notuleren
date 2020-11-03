import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import {belongsTo, hasMany} from 'ember-data/relationships';

export default class BesluitenLijst extends Model {
  @attr state;
  @attr content;
  @hasMany signedResources;
  @belongsTo publishedResource;
  @belongsTo zitting;
}
