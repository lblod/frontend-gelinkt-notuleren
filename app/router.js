import EmberRouter from '@ember/routing/router';
import config from 'frontend-gelinkt-notuleren/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('callback');
  this.route('switch-login');
  this.route('inbox', function () {
    this.route('trash');
    this.route('agendapoints', function () {
      this.route('new');
    });
    this.route('regulatory-statements', function () {
      this.route('new');
    });
    this.route('meetings', function () {
      this.route('new');
    });
    this.route('irg-archive');
  });
  this.route('mock-login');
  this.route('login');

  this.route('legaal', function () {
    this.route('disclaimer');
    this.route('cookieverklaring');
    this.route('toegankelijkheidsverklaring');
  });
  this.route('contact');
  this.route('print', function () {
    this.route('uittreksel', { path: 'uittreksel/:meeting_id/:treatment_id' });
  });
  this.route('route-not-found', {
    path: '/*wildcard',
  });

  this.route('import', function () {
    this.route('new');
    this.route('edit');
  });

  this.route('agendapoints', { path: 'agendapoints/:id' }, function () {
    this.route('edit');
    this.route('attachments');
    this.route('show');
    this.route('revisions');
  });

  this.route('meetings', function () {
    this.route('edit', { path: '/:id/edit' }, function () {
      this.route('intro');
      this.route('outro');
      this.route('treatment', { path: ':treatment_id' });
    });
    this.route('publish', { path: '/:id/publish' }, function () {
      this.route('agenda');
      this.route('besluitenlijst');
      this.route('uittreksels', function () {
        this.route('show', { path: '/:treatment_id' });
      });
      this.route('notulen');
    });
  });

  this.route('irg-archive', function () {
    this.route('show', { path: ':id' });
  });
  this.route('regulatory-statements', function () {
    this.route('edit', { path: '/:id/edit' });
    this.route('show', { path: ':id/show' });
  });
});
