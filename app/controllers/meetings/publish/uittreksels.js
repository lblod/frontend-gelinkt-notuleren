import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { fetch } from 'fetch';
import { action } from '@ember/object';

export default class MeetingsPublishUittrekselsController extends Controller {
  get agendapoints() {
    return this.model.agendapunten;
  }

  get meeting() {
    return this.model;
  }
}
