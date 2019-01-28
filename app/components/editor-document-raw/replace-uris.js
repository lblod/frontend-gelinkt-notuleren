import Component from '@ember/component';

export default Component.extend({

  replaceUris(uris){
    let targetText = this.document.content;
    let resultLog = '';
    for(let uri of uris){
      let occurences = (targetText.match(new RegExp(uri.oldUri, 'g')) || []).length;
      resultLog = resultLog + `Found ${occurences} for ${uri.type} with Olduri: ${uri.oldUri} <br>`;
      targetText = targetText.replace(new RegExp(uri.oldUri, 'g'), uri.newUri);

      //check again
      occurences = (targetText.match(new RegExp(uri.oldUri, 'g')) || []).length;
      resultLog = resultLog + `** After replacement, found ${occurences} for ${uri.type} with Olduri: ${uri.oldUri} <br>`;

      occurences = (targetText.match(new RegExp(uri.newUri, 'g')) || []).length;
      resultLog = resultLog + `-- After replacement, found ${occurences} for ${uri.type} with Newuri: ${uri.newUri} <br>`;
    }
    this.document.set('content', targetText);
    this.set('resultLog', resultLog);
  },

  actions:{
    replace(){
      this.set('resutLog', 'processing');
      let uris = JSON.parse(this.uriData);
      this.replaceUris(uris);
    }
  }
});
