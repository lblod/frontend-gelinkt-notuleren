import type ArDesign from 'frontend-gelinkt-notuleren/models/ar-design';
import AuToolbar from '@appuniversum/ember-appuniversum/components/au-toolbar';
import Component from '@glimmer/component';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import { on } from '@ember/modifier';
import { PlusIcon } from '@appuniversum/ember-appuniversum/components/icons/plus';
import { ArrowLeftIcon } from '@appuniversum/ember-appuniversum/components/icons/arrow-left';
import t from 'ember-intl/helpers/t';

type ArPreviewSignature = {
  Args: {
    arDesign: ArDesign;
    onInsertAR: (arDesign: ArDesign) => unknown;
    onReturnToOverview: () => unknown;
  };
  Element: HTMLDivElement;
};

export default class ArPreview extends Component<ArPreviewSignature> {
  returnToOverview = () => {
    this.args.onReturnToOverview();
  };

  insertAR = () => {
    this.args.onInsertAR(this.args.arDesign);
  };

  <template>
    <div class='ar-importer-preview' ...attributes>
      <AuToolbar @size='medium' as |Group|>
        <Group>
          <AuButton
            @skin='link'
            @icon={{ArrowLeftIcon}}
            {{on 'click' this.returnToOverview}}
          >{{t 'ar-importer.preview.return-to-overview'}}</AuButton>
        </Group>
        <Group>
          <AuButton @icon={{PlusIcon}} {{on 'click' this.insertAR}}>{{t
              'ar-importer.preview.insert'
            }}</AuButton>
        </Group>
      </AuToolbar>
      <div class='ar-importer-preview__content au-u-padding'>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed
          posuere libero. Nunc eget dapibus massa. Aliquam nec condimentum
          justo. Sed in luctus nisi. Proin iaculis metus vitae dapibus
          tincidunt. Etiam quis eros quis augue aliquet tincidunt sit amet eget
          felis. Donec odio magna, lobortis finibus lectus et, ullamcorper
          porttitor lorem. Nam at tristique ex, sed volutpat ante. Donec id
          massa a tortor vulputate varius. Donec a tellus aliquet, scelerisque
          ipsum sed, interdum dolor. Fusce vestibulum maximus laoreet. Aliquam
          sed nunc a quam convallis lobortis at in libero. Ut sagittis ex et
          tortor tristique malesuada. Duis commodo nisl dui, vel scelerisque
          erat vestibulum in. Donec ornare sed neque id mattis. Suspendisse arcu
          nunc, consequat id lorem a, aliquam semper dui. Integer in urna neque.
          Aenean aliquam urna et lorem pretium, et dictum magna venenatis.
          Nullam vel mi metus. Donec in diam vel turpis tempor fringilla ac quis
          nunc. Nam eleifend facilisis turpis, ut lobortis quam feugiat ac.
          Phasellus vel est odio. Quisque luctus tellus ut ex vestibulum
          euismod. In gravida nibh sed porta aliquam. Proin vulputate metus quis
          diam aliquet, id vestibulum eros semper. Nam placerat semper mauris et
          venenatis. Suspendisse sit amet mi id enim iaculis facilisis. Sed
          finibus pulvinar quam, eget luctus neque elementum et. Maecenas luctus
          lorem tempor tortor condimentum, non accumsan arcu rhoncus. Quisque
          sit amet facilisis velit, quis cursus massa. Sed sed nulla ac dolor
          vehicula porta ultrices sit amet nunc. Integer tempor sapien ac tellus
          tempus, vitae sollicitudin diam lacinia. Quisque risus turpis, commodo
          in libero ut, venenatis vehicula sapien. Aliquam ornare sollicitudin
          dignissim. Nulla nec massa nisi. Sed ultrices nulla ex, eu ullamcorper
          tellus iaculis vitae. Morbi ut purus mi. Donec a vulputate risus.
          Phasellus ullamcorper ex non iaculis tincidunt. In in ante et justo
          facilisis mollis. Mauris elementum interdum sagittis. Morbi massa
          turpis, venenatis vitae tellus at, viverra dictum ipsum. Quisque
          faucibus luctus est, sed aliquam nisi lacinia eu. Suspendisse dictum
          magna ut hendrerit laoreet. Duis porttitor efficitur diam sit amet
          egestas. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Nam vel enim tellus. Proin ullamcorper
          eget velit eget varius. Nam lacinia mollis ipsum vel cursus. Curabitur
          convallis tortor eu dui elementum ultrices. Quisque tempor ex quis
          cursus venenatis. Aliquam quis consectetur lorem. Morbi mattis, sem
          vitae fringilla euismod, odio est placerat nisi, a posuere metus metus
          in justo. Maecenas id diam id ex hendrerit interdum. Praesent ut
          pulvinar justo. Proin pretium erat ut mauris consectetur, eu pulvinar
          libero placerat. Pellentesque non arcu vel mauris dictum vulputate.
          Donec lacinia dui a ex semper pretium. Maecenas a purus eget urna
          ultrices dignissim. Ut faucibus rhoncus mauris eu posuere. Sed sodales
          vehicula urna, sagittis facilisis orci. Mauris sit amet sollicitudin
          magna, sed consectetur magna. Vestibulum fringilla lacus in imperdiet
          porttitor. Suspendisse placerat, nisl vitae consequat sollicitudin,
          nunc erat viverra quam, egestas pellentesque felis risus a purus. Sed
          consequat purus eu quam rutrum pretium eget et tellus. Aenean congue
          pretium enim ac suscipit. Aliquam cursus in nisl ac tempus. Maecenas
          faucibus at turpis fermentum semper. Aliquam non euismod leo.
          Pellentesque nec semper velit, eu gravida nisi. Suspendisse potenti.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed
          posuere libero. Nunc eget dapibus massa. Aliquam nec condimentum
          justo. Sed in luctus nisi. Proin iaculis metus vitae dapibus
          tincidunt. Etiam quis eros quis augue aliquet tincidunt sit amet eget
          felis. Donec odio magna, lobortis finibus lectus et, ullamcorper
          porttitor lorem. Nam at tristique ex, sed volutpat ante. Donec id
          massa a tortor vulputate varius. Donec a tellus aliquet, scelerisque
          ipsum sed, interdum dolor. Fusce vestibulum maximus laoreet. Aliquam
          sed nunc a quam convallis lobortis at in libero. Ut sagittis ex et
          tortor tristique malesuada. Duis commodo nisl dui, vel scelerisque
          erat vestibulum in. Donec ornare sed neque id mattis. Suspendisse arcu
          nunc, consequat id lorem a, aliquam semper dui. Integer in urna neque.
          Aenean aliquam urna et lorem pretium, et dictum magna venenatis.
          Nullam vel mi metus. Donec in diam vel turpis tempor fringilla ac quis
          nunc. Nam eleifend facilisis turpis, ut lobortis quam feugiat ac.
          Phasellus vel est odio. Quisque luctus tellus ut ex vestibulum
          euismod. In gravida nibh sed porta aliquam. Proin vulputate metus quis
          diam aliquet, id vestibulum eros semper. Nam placerat semper mauris et
          venenatis. Suspendisse sit amet mi id enim iaculis facilisis. Sed
          finibus pulvinar quam, eget luctus neque elementum et. Maecenas luctus
          lorem tempor tortor condimentum, non accumsan arcu rhoncus. Quisque
          sit amet facilisis velit, quis cursus massa. Sed sed nulla ac dolor
          vehicula porta ultrices sit amet nunc. Integer tempor sapien ac tellus
          tempus, vitae sollicitudin diam lacinia. Quisque risus turpis, commodo
          in libero ut, venenatis vehicula sapien. Aliquam ornare sollicitudin
          dignissim. Nulla nec massa nisi. Sed ultrices nulla ex, eu ullamcorper
          tellus iaculis vitae. Morbi ut purus mi. Donec a vulputate risus.
          Phasellus ullamcorper ex non iaculis tincidunt. In in ante et justo
          facilisis mollis. Mauris elementum interdum sagittis. Morbi massa
          turpis, venenatis vitae tellus at, viverra dictum ipsum. Quisque
          faucibus luctus est, sed aliquam nisi lacinia eu. Suspendisse dictum
          magna ut hendrerit laoreet. Duis porttitor efficitur diam sit amet
          egestas. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Nam vel enim tellus. Proin ullamcorper
          eget velit eget varius. Nam lacinia mollis ipsum vel cursus. Curabitur
          convallis tortor eu dui elementum ultrices. Quisque tempor ex quis
          cursus venenatis. Aliquam quis consectetur lorem. Morbi mattis, sem
          vitae fringilla euismod, odio est placerat nisi, a posuere metus metus
          in justo. Maecenas id diam id ex hendrerit interdum. Praesent ut
          pulvinar justo. Proin pretium erat ut mauris consectetur, eu pulvinar
          libero placerat. Pellentesque non arcu vel mauris dictum vulputate.
          Donec lacinia dui a ex semper pretium. Maecenas a purus eget urna
          ultrices dignissim. Ut faucibus rhoncus mauris eu posuere. Sed sodales
          vehicula urna, sagittis facilisis orci. Mauris sit amet sollicitudin
          magna, sed consectetur magna. Vestibulum fringilla lacus in imperdiet
          porttitor. Suspendisse placerat, nisl vitae consequat sollicitudin,
          nunc erat viverra quam, egestas pellentesque felis risus a purus. Sed
          consequat purus eu quam rutrum pretium eget et tellus. Aenean congue
          pretium enim ac suscipit. Aliquam cursus in nisl ac tempus. Maecenas
          faucibus at turpis fermentum semper. Aliquam non euismod leo.
          Pellentesque nec semper velit, eu gravida nisi. Suspendisse potenti.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed
          posuere libero. Nunc eget dapibus massa. Aliquam nec condimentum
          justo. Sed in luctus nisi. Proin iaculis metus vitae dapibus
          tincidunt. Etiam quis eros quis augue aliquet tincidunt sit amet eget
          felis. Donec odio magna, lobortis finibus lectus et, ullamcorper
          porttitor lorem. Nam at tristique ex, sed volutpat ante. Donec id
          massa a tortor vulputate varius. Donec a tellus aliquet, scelerisque
          ipsum sed, interdum dolor. Fusce vestibulum maximus laoreet. Aliquam
          sed nunc a quam convallis lobortis at in libero. Ut sagittis ex et
          tortor tristique malesuada. Duis commodo nisl dui, vel scelerisque
          erat vestibulum in. Donec ornare sed neque id mattis. Suspendisse arcu
          nunc, consequat id lorem a, aliquam semper dui. Integer in urna neque.
          Aenean aliquam urna et lorem pretium, et dictum magna venenatis.
          Nullam vel mi metus. Donec in diam vel turpis tempor fringilla ac quis
          nunc. Nam eleifend facilisis turpis, ut lobortis quam feugiat ac.
          Phasellus vel est odio. Quisque luctus tellus ut ex vestibulum
          euismod. In gravida nibh sed porta aliquam. Proin vulputate metus quis
          diam aliquet, id vestibulum eros semper. Nam placerat semper mauris et
          venenatis. Suspendisse sit amet mi id enim iaculis facilisis. Sed
          finibus pulvinar quam, eget luctus neque elementum et. Maecenas luctus
          lorem tempor tortor condimentum, non accumsan arcu rhoncus. Quisque
          sit amet facilisis velit, quis cursus massa. Sed sed nulla ac dolor
          vehicula porta ultrices sit amet nunc. Integer tempor sapien ac tellus
          tempus, vitae sollicitudin diam lacinia. Quisque risus turpis, commodo
          in libero ut, venenatis vehicula sapien. Aliquam ornare sollicitudin
          dignissim. Nulla nec massa nisi. Sed ultrices nulla ex, eu ullamcorper
          tellus iaculis vitae. Morbi ut purus mi. Donec a vulputate risus.
          Phasellus ullamcorper ex non iaculis tincidunt. In in ante et justo
          facilisis mollis. Mauris elementum interdum sagittis. Morbi massa
          turpis, venenatis vitae tellus at, viverra dictum ipsum. Quisque
          faucibus luctus est, sed aliquam nisi lacinia eu. Suspendisse dictum
          magna ut hendrerit laoreet. Duis porttitor efficitur diam sit amet
          egestas. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Nam vel enim tellus. Proin ullamcorper
          eget velit eget varius. Nam lacinia mollis ipsum vel cursus. Curabitur
          convallis tortor eu dui elementum ultrices. Quisque tempor ex quis
          cursus venenatis. Aliquam quis consectetur lorem. Morbi mattis, sem
          vitae fringilla euismod, odio est placerat nisi, a posuere metus metus
          in justo. Maecenas id diam id ex hendrerit interdum. Praesent ut
          pulvinar justo. Proin pretium erat ut mauris consectetur, eu pulvinar
          libero placerat. Pellentesque non arcu vel mauris dictum vulputate.
          Donec lacinia dui a ex semper pretium. Maecenas a purus eget urna
          ultrices dignissim. Ut faucibus rhoncus mauris eu posuere. Sed sodales
          vehicula urna, sagittis facilisis orci. Mauris sit amet sollicitudin
          magna, sed consectetur magna. Vestibulum fringilla lacus in imperdiet
          porttitor. Suspendisse placerat, nisl vitae consequat sollicitudin,
          nunc erat viverra quam, egestas pellentesque felis risus a purus. Sed
          consequat purus eu quam rutrum pretium eget et tellus. Aenean congue
          pretium enim ac suscipit. Aliquam cursus in nisl ac tempus. Maecenas
          faucibus at turpis fermentum semper. Aliquam non euismod leo.
          Pellentesque nec semper velit, eu gravida nisi. Suspendisse potenti.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed
          posuere libero. Nunc eget dapibus massa. Aliquam nec condimentum
          justo. Sed in luctus nisi. Proin iaculis metus vitae dapibus
          tincidunt. Etiam quis eros quis augue aliquet tincidunt sit amet eget
          felis. Donec odio magna, lobortis finibus lectus et, ullamcorper
          porttitor lorem. Nam at tristique ex, sed volutpat ante. Donec id
          massa a tortor vulputate varius. Donec a tellus aliquet, scelerisque
          ipsum sed, interdum dolor. Fusce vestibulum maximus laoreet. Aliquam
          sed nunc a quam convallis lobortis at in libero. Ut sagittis ex et
          tortor tristique malesuada. Duis commodo nisl dui, vel scelerisque
          erat vestibulum in. Donec ornare sed neque id mattis. Suspendisse arcu
          nunc, consequat id lorem a, aliquam semper dui. Integer in urna neque.
          Aenean aliquam urna et lorem pretium, et dictum magna venenatis.
          Nullam vel mi metus. Donec in diam vel turpis tempor fringilla ac quis
          nunc. Nam eleifend facilisis turpis, ut lobortis quam feugiat ac.
          Phasellus vel est odio. Quisque luctus tellus ut ex vestibulum
          euismod. In gravida nibh sed porta aliquam. Proin vulputate metus quis
          diam aliquet, id vestibulum eros semper. Nam placerat semper mauris et
          venenatis. Suspendisse sit amet mi id enim iaculis facilisis. Sed
          finibus pulvinar quam, eget luctus neque elementum et. Maecenas luctus
          lorem tempor tortor condimentum, non accumsan arcu rhoncus. Quisque
          sit amet facilisis velit, quis cursus massa. Sed sed nulla ac dolor
          vehicula porta ultrices sit amet nunc. Integer tempor sapien ac tellus
          tempus, vitae sollicitudin diam lacinia. Quisque risus turpis, commodo
          in libero ut, venenatis vehicula sapien. Aliquam ornare sollicitudin
          dignissim. Nulla nec massa nisi. Sed ultrices nulla ex, eu ullamcorper
          tellus iaculis vitae. Morbi ut purus mi. Donec a vulputate risus.
          Phasellus ullamcorper ex non iaculis tincidunt. In in ante et justo
          facilisis mollis. Mauris elementum interdum sagittis. Morbi massa
          turpis, venenatis vitae tellus at, viverra dictum ipsum. Quisque
          faucibus luctus est, sed aliquam nisi lacinia eu. Suspendisse dictum
          magna ut hendrerit laoreet. Duis porttitor efficitur diam sit amet
          egestas. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Nam vel enim tellus. Proin ullamcorper
          eget velit eget varius. Nam lacinia mollis ipsum vel cursus. Curabitur
          convallis tortor eu dui elementum ultrices. Quisque tempor ex quis
          cursus venenatis. Aliquam quis consectetur lorem. Morbi mattis, sem
          vitae fringilla euismod, odio est placerat nisi, a posuere metus metus
          in justo. Maecenas id diam id ex hendrerit interdum. Praesent ut
          pulvinar justo. Proin pretium erat ut mauris consectetur, eu pulvinar
          libero placerat. Pellentesque non arcu vel mauris dictum vulputate.
          Donec lacinia dui a ex semper pretium. Maecenas a purus eget urna
          ultrices dignissim. Ut faucibus rhoncus mauris eu posuere. Sed sodales
          vehicula urna, sagittis facilisis orci. Mauris sit amet sollicitudin
          magna, sed consectetur magna. Vestibulum fringilla lacus in imperdiet
          porttitor. Suspendisse placerat, nisl vitae consequat sollicitudin,
          nunc erat viverra quam, egestas pellentesque felis risus a purus. Sed
          consequat purus eu quam rutrum pretium eget et tellus. Aenean congue
          pretium enim ac suscipit. Aliquam cursus in nisl ac tempus. Maecenas
          faucibus at turpis fermentum semper. Aliquam non euismod leo.
          Pellentesque nec semper velit, eu gravida nisi. Suspendisse potenti.
        </p>
      </div>

    </div>
  </template>
}
