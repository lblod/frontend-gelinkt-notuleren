import Component from '@glimmer/component';
import {task} from "ember-concurrency";
import {action} from '@ember/object';
import {inject as service} from '@ember/service';
import {tracked} from 'tracked-built-ins';

export default class ImportWizardImportMeetingComponent extends Component {
  @tracked step = 'selectDocument'
  @tracked htmlString;
  @tracked readyForNextStep = false;
  @service importer;
  @tracked nextStepButtonLoading = false;
  @tracked meeting;
  @service router;

  @action
  updateHtml(htmlString) {
    this.htmlString = htmlString;
    this.readyForNextStep = true;
  }

  @action
  async goToNextStep() {
    if(this.step === 'selectDocument') {
      this.step = 'previewHtml';
    } else if(this.step === 'previewHtml') {
      this.readyForNextStep = false;
      this.nextStepButtonLoading = true;
      await this.importer.importDocument(this.htmlString);
      this.nextStepButtonLoading = false;
      this.readyForNextStep = true;
      this.meeting = this.importer.meeting;
      this.step = 'confirmationForm';
    } else if(this.step === 'confirmationForm') {
      this.nextStepButtonLoading = true;
      await this.importer.confirmImport();
      this.nextStepButtonLoading = false;
      this.router.transitionTo("meetings.edit", this.meeting.id);
    }
  }

  @action
  goToPreviousStep() {
    if(this.step === 'selectDocument') {
      this.args.toggleModal;
    } else if(this.step === 'previewHtml') {
      this.htmlString = '';
      this.readyForNextStep = false;
      this.step = 'selectDocument';
    } else if(this.step === 'confirmationForm') {
      this.importer.reset();
      this.step = 'previewHtml';
    }
  }
}
