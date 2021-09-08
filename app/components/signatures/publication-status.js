import Component from '@glimmer/component';


export default class SignaturesPublicationStatus extends Component {
  get publicationStatus(){
    const versionedResource = this.args.versionedResource;
    if (versionedResource.get('publishedResource')) {
      return {label: 'Gepubliceerd', color: 'action'};
    }else if (versionedResource.get('signedResources').length === 1) {
      return {label: 'Eerste ondertekening verkregen', color: 'warning'};
    } else if (versionedResource.get('signedResources').length === 2) {
      return {label: 'Getekend', color: 'success'};
    } else {
      return {label: 'Concept'};
    }
  }
}
