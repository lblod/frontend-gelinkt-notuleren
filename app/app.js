import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'frontend-gelinkt-notuleren/config/environment';
import './config/custom-inflector-rules';
import '@glint/environment-ember-loose';
// import { setupServer } from 'frontend-gelinkt-notuleren/mirage/server';

// if (config.environment === 'development') {
//   setupServer({ environment: 'development' });
// }

/**
 * @typedef {import('ember-source/types')} EmberTypes
 */

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
