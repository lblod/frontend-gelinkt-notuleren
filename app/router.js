import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('editor-documents', function() {
    this.route('edit', { path: '/:id/edit' });
    this.route('new');
    this.route('show', { path: '/:id/show'});
  });
  this.route('inbox', function() {
    this.route('archive');
    this.route('trash');
  });
  this.route('besluiten', function() {
    this.route('details', { path: '/:id/details' });
  });
  this.route('published', function() {
    this.route('zitting', { path: '/:id' }, function() {
      this.route('agenda');
      this.route('besluitenlijst', function() {
        this.route('show', { path: '/:behandeling_id' });
      });
      this.route('notulen');
    });
  });
  this.route('mock-login');
  this.route('route-not-found', {
    path: '/*wildcard'
  });
  this.route('login');
});

export default Router;
