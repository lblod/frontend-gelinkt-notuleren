import Service from '@ember/service';
import { service } from '@ember/service';
import type CurrentSessionService from './current-session';
import type Store from './store';
import { CONCEPT_SCHEMES } from 'frontend-gelinkt-notuleren/config/constants';
import ConceptModel from 'frontend-gelinkt-notuleren/models/concept';
import UserPreferenceModel from 'frontend-gelinkt-notuleren/models/user-preference';

export default class UserPreferencesService extends Service {
  @service declare currentSession: CurrentSessionService;
  @service declare store: Store;

  async resolveConcept(key: string) {
    const preferenceConcept = (
      await this.store.query<ConceptModel>('concept', {
        filter: {
          notation: key,
          'concept-schemes': {
            ':uri:': CONCEPT_SCHEMES.USER_PREFERENCES,
          },
        },
      })
    )[0];
    if (!preferenceConcept) {
      throw new Error(`Unable to find related concept for preference ${key}`);
    }
    return preferenceConcept;
  }

  async load(key: string) {
    const user = this.currentSession.user;
    if (!user) {
      throw new Error('User is not authenticated');
    }
    const preferenceConcept = await this.resolveConcept(key);
    const userPreference = (
      await this.store.query<UserPreferenceModel>('user-preference', {
        filter: {
          type: {
            ':id:': preferenceConcept.id,
          },
          gebruiker: {
            ':id:': user.id,
          },
        },
      })
    )[0];
    return userPreference?.value;
  }

  async save(key: string, value: string) {
    const user = this.currentSession.user;
    if (!user) {
      throw new Error('User is not authenticated');
    }
    const preferenceConcept = await this.resolveConcept(key);
    const userPreference =
      (
        await this.store.query<UserPreferenceModel>('user-preference', {
          filter: {
            type: {
              ':id:': preferenceConcept.id,
            },
            gebruiker: {
              ':id:': user.id,
            },
          },
        })
      )[0] ??
      this.store.createRecord<UserPreferenceModel>('user-preference', {
        value,
        type: preferenceConcept,
        gebruiker: user,
      });
    userPreference.value = value;
    await userPreference.save();
  }
}
