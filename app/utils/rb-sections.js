// Sections must be ordered from more to less specifity
const SECTIONS = [
  {
    id: 'title',
    label: 'copy-options.regulatory-statements.title',
    selector:
      '[typeof="say:Title"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Title"]>[data-content-container="true"]',
    childTypes: ['chapter', 'section', 'subsection', 'article'],
  },
  {
    id: 'chapter',
    label: 'copy-options.regulatory-statements.chapter',
    selector:
      '[typeof="say:Chapter"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Chapter"]>[data-content-container="true"]',
    childTypes: ['section', 'subsection', 'article'],
  },
  {
    id: 'section',
    label: 'copy-options.regulatory-statements.section',
    selector:
      '[typeof="say:Section"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Section"]>[data-content-container="true"]',
    childTypes: ['subsection', 'article'],
  },
  {
    id: 'subsection',
    label: 'copy-options.regulatory-statements.subsection',
    selector:
      '[typeof="say:Subsection"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Subsection"]>[data-content-container="true"]',
    childTypes: ['article'],
  },
  {
    id: 'article',
    label: 'copy-options.regulatory-statements.article',
    selector:
      '[typeof="say:Article"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Article"]>[data-content-container="true"]',
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
