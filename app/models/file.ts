import Model, { attr } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';

const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB'];

export default class FileModel extends Model {
  declare [Type]: 'file';

  @attr name?: string;
  @attr format?: string;
  @attr size?: number;
  @attr extension?: string;
  @attr('datetime') created?: Date;

  get humanReadableSize() {
    //ripped from https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
    const bytes = this.size;
    if (!bytes) return '0 byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  }

  get downloadLink() {
    return `/files/${this.id}/download?name=${this.name}`;
  }
}
