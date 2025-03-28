import AuPill, {
  type AuPillSignature,
} from '@appuniversum/ember-appuniversum/components/au-pill';
import type { TOC } from '@ember/component/template-only';

type Item = {
  label: string;
  value?: string;
  pill?: {
    skin?: AuPillSignature['Args']['skin'];
    draft?: AuPillSignature['Args']['draft'];
    icon?: AuPillSignature['Args']['icon'];
    text?: string;
  };
};
type Signature = {
  Args: {
    items: Item[];
  };
};
const DetailsList: TOC<Signature> = <template>
  <ul class='au-c-list-divider au-c-details-list'>
    {{#each @items as |item|}}
      <li class='au-c-list-divider__item au-c-details-list__item'>
        <span class='au-c-details-list__label'>{{item.label}}</span>
        <div class='au-c-details-list__value'>
          {{#if item.value}}
            <strong
              class='au-c-details-list__value-text'
            >{{item.value}}</strong>
          {{/if}}
          {{#if item.pill}}
            <span class='au-c-details-list__value-pill'>
              <AuPill
                @skin={{item.pill.skin}}
                @draft={{item.pill.draft}}
                @icon={{item.pill.icon}}
                @iconAlignment='left'
              >
                {{item.pill.text}}
              </AuPill>
            </span>
          {{/if}}
        </div>
      </li>
    {{/each}}
  </ul>
</template>;

export default DetailsList;
