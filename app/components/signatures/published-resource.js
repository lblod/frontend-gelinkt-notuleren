import Component from '@glimmer/component';


export default class SignaturesPublishedResourceComponent extends Component {
  get submissionFailed() {
    return this.args.publication.submissionStatus === "http://lblod.data.gift/publication-submission-statuses/failure";
  }

  get submissionSucceeded() {
    return this.args.publication.submissionStatus === "http://lblod.data.gift/publication-submission-statuses/success";
  }
}

