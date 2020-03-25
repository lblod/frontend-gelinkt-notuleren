import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('editor-documents', function() {
    this.route('edit', { path: '/:id/edit' });
    this.route('new');
    this.route('show', { path: '/:id/show' });
    this.route('raw', { path: '/:id/raw' });

    this.route('revisions', { path: '/:id/revisions' }, function() {
      this.route('index', { path: '/' });
    });
  });
  this.route('inbox', function() {
    this.route('archive');
    this.route('trash');
    this.route('imported');
    this.route('ontwerpbesluiten');
  });
  this.route('mock-login');
  this.route('login');
  this.route('zetelverdeling');

  this.route('legaal', function() {
    this.route('disclaimer');
    this.route('cookieverklaring');
  });
  this.route('contact');
  this.route('documents', function() {
    this.route('show', { path: '/:id' }, function() {
      this.route('publish', function() {
        this.route('overview');
        this.route('agenda');
        this.route('besluitenlijst');
        this.route('notulen');
        this.route('uittreksels');
      });
    });
  });
  this.route('print', function() {
    this.route('uittreksel', { path: '/uittreksel/:id' });
  });
  this.route('route-not-found', {
    path: '/*wildcard'
  });

  this.route('import', function() {
    this.route('new');
    this.route('edit');
  });

  this.route('imported-documents', function() {
    this.route('new');
    this.route('show');
    this.route('edit');
    this.route('templates');
    this.route('publish');
  });

  this.route('ontwerpbesluiten', function() {});

  this.route('ontwerpbesluiten-documents', function() {
    this.route('new');
    this.route('demo-1-b');
    this.route('demo-1-a');
    this.route('demo-2');
    this.route('demo-3');
    this.route('demo-besluitsjabloon');
  });
});
