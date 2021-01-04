import Component from '@glimmer/component';


export default class SignaturesNotulenBehandelingList extends Component {
  get isPublished() {
    return this.args.notulen.get('publishedResource');
  }

}
