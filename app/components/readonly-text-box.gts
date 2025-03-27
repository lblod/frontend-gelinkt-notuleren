import type { TOC } from '@ember/component/template-only';

type Signature = {
  Blocks: {
    default: [];
  };
};

const ReadonlyTextBox: TOC<Signature> = <template>
  <div class='au-o-box au-o-box--small au-c-editor-preview say-content'>
    {{yield}}
  </div>
</template>;

export default ReadonlyTextBox;
