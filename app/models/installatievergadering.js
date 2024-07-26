import ZittingModel from './zitting';
import { attr } from '@ember-data/model';

export default class InstallatieVergaderingModel extends ZittingModel {
  @attr('datetime') lastSynchronization;
}
