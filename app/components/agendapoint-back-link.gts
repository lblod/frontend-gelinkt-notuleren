import Component from '@glimmer/component';
import { trackedFunction } from 'reactiveweb/function';
import ZittingModel from 'frontend-gelinkt-notuleren/models/zitting';
import AuLink from '@appuniversum/ember-appuniversum/components/au-link';
import AuIcon from '@appuniversum/ember-appuniversum/components/au-icon';
import t from 'ember-intl/helpers/t';
import { detailedDate } from 'frontend-gelinkt-notuleren/utils/detailed-date';

interface Sig {
  Args: {
    meeting?: ZittingModel;
  };
}

export default class ZittingLinkComponent extends Component<Sig> {
  administrativeBodyName = trackedFunction(this, async () => {
    const bestuursorgaan = await this.args.meeting?.bestuursorgaan;
    const parentOrgaan = await bestuursorgaan?.isTijdsspecialisatieVan;
    return parentOrgaan?.naam;
  });

  <template>
    {{#if this.administrativeBodyName.value}}
      <AuLink @route='meetings.edit' @model={{@meeting}}>
        <AuIcon @icon='arrow-left' @alignment='left' />
        {{t
          'agendapoint.back-to-meeting'
          adminBody=this.administrativeBodyName.value
          date=(detailedDate @meeting.geplandeStart)
        }}
      </AuLink>
    {{else}}
      <AuLink @route='inbox.agendapoints' @skin='secondary'>
        <AuIcon @icon='arrow-left' @alignment='left' />
        {{t 'inbox.agendapoints.return'}}
      </AuLink>
    {{/if}}
  </template>
}
