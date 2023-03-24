import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default class PublishingLogDocumentNameComponent extends Component {
  @tracked documentName;
  @tracked deleted;
  @tracked route;
  @tracked behandeling;
  @service intl;

  @task
  *loadData() {
    const log = this.args.log;
    const logResource =
      (yield log.signedResource) ?? (yield log.publishedResource);
    let versionedResource;
    const agenda = yield logResource.agenda;
    if (agenda) {
      versionedResource = agenda;
      const type = versionedResource.agendaType;
      switch (type) {
        case 'gepland':
          this.documentName = this.intl.t('publication-actions.planned-agenda');
          break;
        case 'aanvullend':
          this.documentName = this.intl.t(
            'publication-actions.suplemental-agenda'
          );
          break;
        case 'spoedeisend':
          this.documentName = this.intl.t('publication-actions.urgent-agenda');
          break;
      }
      this.route = 'meetings.publish.agenda';
    } else {
      const versionedNotulen = yield logResource.versionedNotulen;
      if (versionedNotulen) {
        this.documentName = this.intl.t('publication-actions.notulen');
        versionedResource = versionedNotulen;
        this.route = 'meetings.publish.notulen';
      } else {
        const versionedBesluitenLijst =
          yield logResource.versionedBesluitenLijst;
        if (versionedBesluitenLijst) {
          this.documentName = this.intl.t('publication-actions.decision-list');
          versionedResource = versionedBesluitenLijst;
          this.route = 'meetings.publish.besluitenlijst';
        } else {
          const versionedBehandeling = logResource.versionedBehandeling;
          if (versionedBehandeling) {
            this.documentName = this.intl.t('publication-actions.treatment');
            versionedResource = yield logResource.versionedBehandeling;
            const behandeling = yield versionedResource.behandeling;
            if (behandeling) {
              const onderwerp = yield behandeling.onderwerp;
              this.documentName += ` [${onderwerp.titel}]`;
            }
            this.route = 'meetings.publish.uittreksels';
          }
        }
      }
    }
    this.deleted = versionedResource.get('deleted');
  }
}
