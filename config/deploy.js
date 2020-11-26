/* eslint-env node */
'use strict';

module.exports = function(deployTarget) {
  //see https://github.com/ember-cli-deploy/ember-cli-deploy-revision-data/issues/52
  process.env.GIT_DISCOVERY_ACROSS_FILESYSTEM=1;

  let ENV = {
    build: {
      environment: 'production'
    },
    'ssh-index': {
      username: 'root',
      host: 'rpio-dev.s.redpencil.io',
      remoteDir: '/data/app-gelinkt-notuleren-dev/gelinkt-notuleren-app',
      agent: process.env.SSH_AUTH_SOCK,
      port: 22,
      allowOverwrite: true
    },
    'rsync': {
      dest: '/data/app-gelinkt-notuleren-dev/gelinkt-notuleren-app',
      username: 'root',
      host: 'rpio-dev.s.redpencil.io',
      port: 22,
      delete: false,
      privateKey: process.env.SSH_AUTH_SOCK,
      arg:['--verbose']
    }
  };

  if (deployTarget === 'futurenow') {
    ENV.build.environment = 'development';
    ENV.rsync.dest = '/data/app-gelinkt-notuleren-dev/gelinkt-notuleren-futurenow-app';
    ENV['ssh-index'].remoteDir = '/data/app-gelinkt-notuleren-dev/gelinkt-notuleren-futurenow-app';
  }

  if (deployTarget === 'demo') {
    ENV['ssh-index'] = {
      username: 'root',
      host: 'demo-lblod.s.redpencil.io',
      remoteDir: '/data/app-gelinkt-notuleren/gelinkt-notuleren-app',
      agent: process.env.SSH_AUTH_SOCK,
      port: 22,
      allowOverwrite: true
    };
    ENV['rsync'] = {
      dest: '/data/app-gelinkt-notuleren/gelinkt-notuleren-app',
      username: 'root',
      host: 'demo-lblod.s.redpencil.io',
      port: 22,
      delete: false,
      arg:['--verbose']
    };
  }

  return ENV;
};
