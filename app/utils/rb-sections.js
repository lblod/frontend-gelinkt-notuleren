// Sections must be ordered from more to less specifity
const SECTIONS = [
  {
    id: 'title',
    labelSelector:
      '[property="https://say.data.gift/ns/heading"]>[data-content-container="true"], [property="say:heading"]>[data-content-container="true"]',
    contentSelector:
      '[property="https://say.data.gift/ns/body"]>[data-content-container="true"], [property="say:body"]>[data-content-container="true"]',
    selector:
      '[typeof="say:Title"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Title"]>[data-content-container="true"]',
    childTypes: ['chapter', 'section', 'subsection', 'article'],
  },
  {
    id: 'chapter',
    labelSelector:
      '[property="https://say.data.gift/ns/heading"]>[data-content-container="true"], [property="say:heading"]>[data-content-container="true"]',
    contentSelector:
      '[property="https://say.data.gift/ns/body"]>[data-content-container="true"], [property="say:body"]>[data-content-container="true"]',
    selector:
      '[typeof="say:Chapter"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Chapter"]>[data-content-container="true"]',
    childTypes: ['section', 'subsection', 'article'],
  },
  {
    id: 'section',
    labelSelector:
      '[property="https://say.data.gift/ns/heading"]>[data-content-container="true"], [property="say:heading"]>[data-content-container="true"]',
    contentSelector:
      '[property="https://say.data.gift/ns/body"]>[data-content-container="true"], [property="say:body"]>[data-content-container="true"]',
    selector:
      '[typeof="say:Section"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Section"]>[data-content-container="true"]',
    childTypes: ['subsection', 'article'],
  },
  {
    id: 'subsection',
    labelSelector:
      '[property="https://say.data.gift/ns/heading"]>[data-content-container="true"], [property="say:heading"]>[data-content-container="true"]',
    contentSelector:
      '[property="https://say.data.gift/ns/body"]>[data-content-container="true"], [property="say:body"]>[data-content-container="true"]',
    selector:
      '[typeof="say:Subsection"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Subsection"]>[data-content-container="true"]',
    childTypes: ['article'],
  },
  {
    id: 'article',
    labelSelector:
      '[property="https://say.data.gift/ns/heading"]>[data-content-container="true"], [property="say:heading"]>[data-content-container="true"]',
    selector:
      '[typeof="say:Article"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Article"]>[data-content-container="true"]',
    contentSelector:
      '[property="https://say.data.gift/ns/body"]>[data-content-container="true"], [property="say:body"]>[data-content-container="true"]',
    childTypes: ['paragraph'],
  },
  {
    id: 'paragraph',
    label: 'copy-options.regulatory-statements.paragraph',
    selector:
      '[typeof="say:Paragraph"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Paragraph"]>[data-content-container="true"]',
  },
];

export default SECTIONS;
