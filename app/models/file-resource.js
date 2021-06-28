import Model, { attr }from '@ember-data/model';


export default class FileResourceModel extends Model {
  @attr name;
  @attr format;
  @attr size;
  @attr extension;
  @attr('datetime') created;
}
