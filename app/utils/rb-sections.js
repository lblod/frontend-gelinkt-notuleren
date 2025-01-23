// Sections must be ordered from more to less specifity, we have to order them so the highest level section is found first in the array
const SECTIONS = [
  {
    id: 'title',
    labelSelector:
      '[property="https://say.data.gift/ns/heading"]>[data-content-container="true"], [property="say:heading"]>[data-content-container="true"]',
    contentSelector:
      '[property="https://say.data.gift/ns/body"]>[data-content-container="true"], [property="say:body"]>[data-content-container="true"]',
    selector: '[typeof="say:Title"], [typeof="https://say.data.gift/ns/Title"]',
  },
  {
    id: 'chapter',
    labelSelector:
      '[property="https://say.data.gift/ns/heading"]>[data-content-container="true"], [property="say:heading"]>[data-content-container="true"]',
    contentSelector:
      '[property="https://say.data.gift/ns/body"]>[data-content-container="true"], [property="say:body"]>[data-content-container="true"]',
    selector:
      '[typeof="say:Chapter"], [typeof="https://say.data.gift/ns/Chapter"]',
  },
  {
    id: 'section',
    labelSelector:
      '[property="https://say.data.gift/ns/heading"]>[data-content-container="true"], [property="say:heading"]>[data-content-container="true"]',
    contentSelector:
      '[property="https://say.data.gift/ns/body"]>[data-content-container="true"], [property="say:body"]>[data-content-container="true"]',
    selector:
      '[typeof="say:Section"], [typeof="https://say.data.gift/ns/Section"]',
  },
  {
    id: 'subsection',
    labelSelector:
      '[property="https://say.data.gift/ns/heading"]>[data-content-container="true"], [property="say:heading"]>[data-content-container="true"]',
    contentSelector:
      '[property="https://say.data.gift/ns/body"]>[data-content-container="true"], [property="say:body"]>[data-content-container="true"]',
    selector:
      '[typeof="say:Subsection"], [typeof="https://say.data.gift/ns/Subsection"]',
  },
  {
    id: 'article',
    labelSelector:
      '[property="https://say.data.gift/ns/heading"]>[data-content-container="true"], [property="say:heading"]>[data-content-container="true"]',
    selector:
      '[typeof="say:Article"], [typeof="https://say.data.gift/ns/Article"]',
    contentSelector:
      '[property="https://say.data.gift/ns/body"]>[data-content-container="true"], [property="say:body"]>[data-content-container="true"]',
  },
  {
    id: 'paragraph',
    label: 'copy-options.regulatory-statements.paragraph',
    selector:
      '[typeof="say:Paragraph"], [typeof="https://say.data.gift/ns/Paragraph"]',
    contentSelector:
      '[property="https://say.data.gift/ns/body"]>[data-content-container="true"], [property="say:body"]>[data-content-container="true"]',
  },
];

export default SECTIONS;
