import Service, { service } from '@ember/service';
import { task } from 'ember-concurrency';

/**
 * A number, or a string containing a number.
 * @typedef {('te-behandelen'|'in-behandeling'|'behandeld'|'te-behandelen-awv')} AanvraagStatus
 */

/**
 * @typedef Aanvraag
 * @type {object}
 * @property {AanvraagStatus} status
 * @property {string} title
 * @property {Date} createdOn
 */
/**
 * @type {Aanvraag[]}
 */
export default class VerenigingsloketService extends Service {
  @service store;

  get sampleData() {
    return [
      this.store.createRecord('aanvraag-verenigingsloket', {
        title: 'Veldrit Oudenaarde',
        createdOn: new Date(),
        status: 'te-behandelen',
      }),
      this.store.createRecord('aanvraag-verenigingsloket', {
        title: 'Koers Waregem',
        createdOn: new Date(),
        status: 'te-behandelen',
      }),
      this.store.createRecord('aanvraag-verenigingsloket', {
        title: 'MTB Ronse',
        createdOn: new Date(),
        status: 'te-behandelen',
      }),
      this.store.createRecord('aanvraag-verenigingsloket', {
        title: 'Koers Oostakker',
        createdOn: new Date(),
        status: 'in-behandeling',
      }),
      this.store.createRecord('aanvraag-verenigingsloket', {
        title: 'Gravel Meise',
        createdOn: new Date(),
        status: 'in-behandeling',
      }),
      this.store.createRecord('aanvraag-verenigingsloket', {
        title: 'MTB Antwerpen',
        createdOn: new Date(),
        status: 'in-behandeling',
      }),
      this.store.createRecord('aanvraag-verenigingsloket', {
        title: 'Koers Gent',
        createdOn: new Date(),
        status: 'behandeld',
      }),
      this.store.createRecord('aanvraag-verenigingsloket', {
        title: 'Veldrit Aalst',
        createdOn: new Date(),
        status: 'behandeld',
      }),
      this.store.createRecord('aanvraag-verenigingsloket', {
        title: 'MTB Eeklo',
        createdOn: new Date(),
        status: 'te-behandelen-awv',
      }),
    ];
  }

  fetch = task(async ({ status, title = '' }) => {
    return this.sampleData.filter((aanvraag) => {
      return aanvraag.title.includes(title) && aanvraag.status === status;
    });
  });
}
