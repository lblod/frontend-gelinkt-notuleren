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
      log.get('signedResource') ?? log.get('publishedResource');
    yield logResource;
    let versionedResource;
    if (yield logResource.get('agenda')) {
      versionedResource = yield logResource.get('agenda');
      const type = versionedResource.get('agendaType');
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
    } else if (yield logResource.get('versionedNotulen')) {
      this.documentName = this.intl.t('publication-actions.notulen');
      versionedResource = logResource.get('versionedNotulen');
      this.route = 'meetings.publish.notulen';
    } else if (yield logResource.get('versionedBesluitenLijst')) {
      this.documentName = this.intl.t('publication-actions.decision-list');
      versionedResource = logResource.get('versionedBesluitenLijst');
      this.route = 'meetings.publish.besluitenlijst';
    } else if (yield logResource.get('versionedBehandeling')) {
      this.documentName = this.intl.t('publication-actions.treatment');
      versionedResource = yield logResource.get('versionedBehandeling');
      const behandeling = yield versionedResource.get('behandeling');
      if (behandeling) {
        const onderwerp = yield behandeling.get('onderwerp');
        this.documentName += ` [${onderwerp.get('titel')}]`;
      }
      this.route = 'meetings.publish.uittreksels';
    }
    this.deleted = versionedResource.get('deleted');
  }
}
