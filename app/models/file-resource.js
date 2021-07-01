import Model, { attr }from '@ember-data/model';


export default class FileResourceModel extends Model {
  @attr name;
  @attr format;
  @attr size;
  @attr extension;
  @attr('datetime') created;

  get humanReadableSize(){
    //ripped from https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
    const bytes = this.size;
    const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }

  get downloadLink(){
    return `/files/${this.id}/download?name=${this.name}`;
  }
}
