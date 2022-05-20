import { MarkSpec } from '@lblod/ember-rdfa-editor/model/mark';
import {
  RenderSpec,
  SLOT,
} from '@lblod/ember-rdfa-editor/model/util/render-spec';

export const italicMarkSpec: MarkSpec = {
  matchers: [{ tag: 'em' }, { tag: 'i' }],
  priority: 200,
  name: 'italic',
  renderSpec(): RenderSpec {
    return ['em', [SLOT]];
  },
};
