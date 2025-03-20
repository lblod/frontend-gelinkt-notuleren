import { type TemplateOnlyComponent } from '@ember/component/template-only';
import t from 'ember-intl/helpers/t';
import AuPill, {
  type AuPillSignature,
} from '@appuniversum/ember-appuniversum/components/au-pill';

interface Sig {
  Element: AuPillSignature['Element'];
}

const RequiredField: TemplateOnlyComponent<Sig> = <template>
  <AuPill ...attributes>{{t 'required-field.required'}}</AuPill>
</template>;

export default RequiredField;
