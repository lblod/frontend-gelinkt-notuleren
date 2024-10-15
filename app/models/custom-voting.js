import { belongsTo } from '@ember-data/model';
import StemmingModel from './stemming';

export default class CustomVotingModel extends StemmingModel {
  @belongsTo('document-container', { inverse: null, async: true })
  votingDocument;
}
