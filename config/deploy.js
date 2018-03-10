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
      host: 'dock.semte.ch',
      remoteDir: '/data/lblod/dev-lblod-apis/demo-app',
      agent: process.env.SSH_AUTH_SOCK,
      port: 2275,
      allowOverwrite: true
    },
    'rsync': {
      dest: '/data/lblod/dev-lblod-apis/demo-app',
      username: 'root',
      host: 'dock.semte.ch',
      port: 2275,
      delete: false,
      privateKey: process.env.SSH_AUTH_SOCK,
      arg:['--verbose']
    }
  };

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    ENV['ssh-index'] = {
      username: 'root',
      host: 'dock.semte.ch',
      remoteDir: '/data/lblod/lblod-apis/demo-app',
      agent: process.env.SSH_AUTH_SOCK,
      port: 2275,
      allowOverwrite: true
    };

    ENV['rsync'] = {
      dest: '/data/lblod/lblod-apis/demo-app',
      username: 'root',
      host: 'dock.semte.ch',
      port: 2275,
      delete: false,
      privateKey: process.env.SSH_AUTH_SOCK,
      arg:['--verbose']
    };
  }

  if (deployTarget === 'scrat') {
    ENV.build.environment = 'production';
    ENV['ssh-index'] = {
      username: 'root',
      host: 'dev-editor.moof-it.be',
      remoteDir: '/data/lblod/lblod-apis/demo-app',
      agent: process.env.SSH_AUTH_SOCK,
      port: 22,
      allowOverwrite: true
    };

    ENV['rsync'] = {
      dest: '/data/lblod/lblod-apis/demo-app',
      username: 'root',
      host: 'dev-editor.moof-it.be',
      port: 22,
      delete: false,
      privateKey: process.env.SSH_AUTH_SOCK,
      arg:['--verbose']
    };
  }

  return ENV;
};
