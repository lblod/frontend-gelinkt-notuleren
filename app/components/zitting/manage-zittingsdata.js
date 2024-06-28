import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

import { detailedDate } from '../../utils/detailed-date';

export default class ZittingManageZittingsdataComponent extends Component {
  @service intl;

  @tracked showModal = false;

  @tracked geplandeStart;
  @tracked gestartOpTijdstip;
  @tracked geeindigdOpTijdstip;
  @tracked opLocatie;
  @tracked bestuursorgaan;

  constructor() {
    super(...arguments);
    this.initializeState();
  }
  initializeState() {
    this.geplandeStart = this.zitting.geplandeStart;
    this.gestartOpTijdstip = this.zitting.gestartOpTijdstip;
    this.geeindigdOpTijdstip = this.zitting.geeindigdOpTijdstip;
    this.opLocatie = this.zitting.opLocatie;
    this.bestuursorgaan = this.zitting.bestuursorgaan;
  }

  get zitting() {
    return this.args.zitting;
  }
  @action
  async saveZittingsData() {
    this.zitting.geplandeStart = this.geplandeStart;
    this.zitting.gestartOpTijdstip = this.gestartOpTijdstip;
    this.zitting.geeindigdOpTijdstip = this.geeindigdOpTijdstip;
    this.zitting.opLocatie = this.opLocatie;
    this.zitting.bestuursorgaan = this.bestuursorgaan;

    await this.zitting.save();
    this.toggleModal();
  }

  @action
  cancel() {
    this.zitting.rollbackAttributes();
    this.initializeState();
    this.toggleModal();
  }
  @action
  toggleModal() {
    this.showModal = !this.showModal;
  }

  @action
  changeDate(targetProperty, value) {
    this[targetProperty] = value;
  }

  get startDateIsEmpty() {
    return !this.zitting.gestartOpTijdstip;
  }

  get endDateIsEmpty() {
    return !this.zitting.geeindigdOpTijdstip;
  }

  get startDiffersFromPlannedStart() {
    if (!!this.zitting.geplandeStart && !!this.zitting.gestartOpTijdstip) {
      return this.geplandeStart.getTime() !== this.gestartOpTijdstip.getTime();
    } else return false;
  }

  get endIsBeforeStart() {
    if (this.endDateIsEmpty || this.startDateIsEmpty) {
      return false;
    } else return this.geeindigdOpTijdstrip > this.gestartOpTijdstip;
  }

  /**
   * @param {ChangeEvent<HTMLInputElement>} event
   */
  @action
  handleOpLocatieChange(event) {
    this.opLocatie = event.target.value;
  }

  get infoListItems() {
    return [
      {
        label: this.intl.t('manage-zittings-data.bestuursorgan-label'),
        value: this.bestuursorgaan.get('isTijdsspecialisatieVan.naam'),
      },
      {
        label: this.intl.t('manage-zittings-data.geplande-start-label'),
        value: detailedDate(this.geplandeStart),
      },
      {
        label: this.intl.t('manage-zittings-data.op-locatie-label'),
        value: this.opLocatie,
      },
      {
        label: this.intl.t('manage-zittings-data.gestart-op-tijdstip-label'),
        value: detailedDate(this.gestartOpTijdstip),
        pill: this.startDiffersFromPlannedStart
          ? {
              skin: 'info',
              draft: true,
              icon: 'info-circle',
              text: this.intl.t(
                'manage-zittings-data.start-differs-from-planned-start',
              ),
            }
          : this.startDateIsEmpty
          ? {
              skin: 'warning',
              icon: 'alert-triangle',
              text: this.intl.t('manage-zittings-data.start-not-set'),
            }
          : null,
      },
      {
        label: this.intl.t('manage-zittings-data.geeindigd-op-tijdstip-label'),
        value: detailedDate(this.geeindigdOpTijdstip),
        pill: this.endDateIsEmpty
          ? {
              skin: 'warning',
              icon: 'alert-triangle',
              text: this.intl.t('manage-zittings-data.end-not-set'),
            }
          : this.endIsBeforeStart
          ? {
              skin: 'warning',
              icon: 'alert-triangle',
              text: this.intl.t('manage-zittings-data.end-before-start'),
            }
          : null,
      },
    ];
  }
}
