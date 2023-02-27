import Service from '@ember/service';

const HOUSE_CSS_FILE_ID = 'houseCssFileID';

export default class HouseCssService extends Service {
  setFileId(fileId) {
    localStorage.setItem(HOUSE_CSS_FILE_ID, fileId);
  }

  get getFileUrl() {
    const fileId = localStorage.getItem(HOUSE_CSS_FILE_ID);

    // Making it work when developing on localhost
    return `https://dev.gelinkt-notuleren.lblod.info/files/${fileId}/download`;
  }
}
