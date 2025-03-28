import { getOwner } from '@ember/application';
import EmberRouter from '@ember/routing/router';
import RouterService from '@ember/routing/router-service';
import config from 'frontend-gelinkt-notuleren/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('switch-login');
  this.route('authorization', function () {
    this.route('callback');
    this.route('login');
    this.route('logout');
    this.route('switch');
  });
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
      this.route('new-inauguration');
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

  this.route('import', function () {
    this.route('new');
    this.route('edit');
  });

  this.route('agendapoints', { path: 'agendapoints/:id' }, function () {
    this.route('edit');
    this.route('attachments');
    this.route('show');
    this.route('revisions');
    this.route('copy');
  });

  this.route('meetings', function () {
    this.route('edit', { path: '/:id/edit' }, function () {
      this.route('intro');
      this.route('outro');
      this.route('treatment', { path: ':treatment_id' });
      this.route('custom-voting', { path: '/custom-voting/:voting_id' });
    });
    this.route('publish', { path: '/:id/publish' }, function () {
      this.route('agenda');
      this.route('besluitenlijst');
      this.route('uittreksels', function () {
        this.route('show', { path: '/:treatment_id' });
      });
      this.route('notulen');
      this.route('publication-actions', function () {
        this.route('detail', { path: '/:publishing_log_id' });
      });
    });
    this.route('download', { path: '/:id/download' }, function () {
      this.route('copy', { path: ':container_id/copy' });
    });
  });

  this.route('irg-archive', function () {
    this.route('show', { path: ':id' });
  });
  this.route('regulatory-statements', function () {
    this.route('edit', { path: '/:id/edit' }, function () {
      this.route('history');
    });
    this.route('show', { path: ':id/show' }, function () {
      this.route('history');
    });
    this.route(
      'revisions',
      { path: '/:container_id/revisions/:document_id' },
      function () {
        this.route('history');
      },
    );
    this.route('copy', { path: ':id/copy' });
  });
  this.route('not-found', { path: '/*path' });
});

// Hack to workaround bug with router.transitionTo and router.replaceWith, see
// https://github.com/emberjs/ember.js/issues/19497#issuecomment-2164641248
RouterService.reopen({
  /**
   * Use this method instead of `router.transitionTo()` when that method results in the model hook
   * re-running. This is not in all cases however.
   */
  legacyTransitionTo: function () {
    // eslint-disable-next-line ember/no-private-routing-service
    return getOwner(this)
      .lookup('router:main')
      .transitionTo(...arguments);
  },
  /**
   * Use this method instead of `router.replaceWith()` to avoid re-running model hooks on parts of
   * the path that have not changed
   */
  legacyReplaceWith: function () {
    // eslint-disable-next-line ember/no-private-routing-service
    return getOwner(this)
      .lookup('router:main')
      .replaceWith(...arguments);
  },
});
