import ZittingModel from './zitting';
import { belongsTo } from '@ember-data/model';

export default class InstallatieVergaderingModel extends ZittingModel {
  @belongsTo('installatievergadering-synchronization-status')
  synchronizationStatus;
}
