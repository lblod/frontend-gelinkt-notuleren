import Model, { attr } from '@ember-data/model';

export default class AanvraagVerenigingsloketModel extends Model {
  @attr('string') title;
  @attr('string') organizer;
  @attr('string') status;
  @attr('datetime') createdOn;
  @attr('datetime') dueDate;
}
