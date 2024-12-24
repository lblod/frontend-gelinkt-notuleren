// Sections must be ordered from more to less specifity
const SECTIONS = {
  title: {
    label: 'copy-options.regulatory-statements.title',
    selector:
      '[typeof="say:Title"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Title"]>[data-content-container="true"]',
    splitSelector:
      '[typeof="say:Chapter"], [typeof="https://say.data.gift/ns/Chapter"]',
    childTypes: ['chapter'],
  },
  chapter: {
    label: 'copy-options.regulatory-statements.chapter',
    selector:
      '[typeof="say:Chapter"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Chapter"]>[data-content-container="true"]',
    childTypes: ['section'],
  },
  section: {
    label: 'copy-options.regulatory-statements.section',
    selector:
      '[typeof="say:Section"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Section"]>[data-content-container="true"]',
    childTypes: ['subsection'],
  },
  subsection: {
    label: 'copy-options.regulatory-statements.subsection',
    selector:
      '[typeof="say:Subsection"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Subsection"]>[data-content-container="true"]',
    childTypes: ['article'],
  },
  article: {
    label: 'copy-options.regulatory-statements.article',
    selector:
      '[typeof="say:Article"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Article"]>[data-content-container="true"]',
    childTypes: ['paragraph'],
  },
  paragraph: {
    label: 'copy-options.regulatory-statements.paragraph',
    selector:
      '[typeof="say:Paragraph"]>[data-content-container="true"], [typeof="https://say.data.gift/ns/Paragraph"]>[data-content-container="true"]',
  },
};

export default SECTIONS;
