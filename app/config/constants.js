export const EDITOR_FOLDERS = {
  IRG_ARCHIVE: '17b39ab5-9da6-42fd-8568-2b1a848cd21c',
  DECISION_DRAFTS: 'ae5feaed-7b70-4533-9417-10fbbc480a4c',
  REGULATORY_STATEMENTS: 'd80d06d2-8fc2-4b12-821f-e88b2f035a44',
  TRASH: '5A8304E8C093B00009000010',
};

export const PLUGIN_CONFIGS = {
  TABLE_OF_CONTENTS: [
    {
      nodeHierarchy: [
        'title|chapter|section|subsection|article',
        'structure_header|article_header',
      ],
    },
  ],
  date: (intl) => {
    return {
      formats: [
        {
          label: intl.t('dateFormat.shortDate'),
          key: 'short',
          dateFormat: 'dd/MM/yy',
          dateTimeFormat: 'dd/MM/yy HH:mm',
        },
        {
          label: intl.t('dateFormat.longDate'),
          key: 'long',
          dateFormat: 'EEEE dd MMMM yyyy',
          dateTimeFormat: 'EEEE dd MMMM yyyy at HH:mm',
        },
      ],
      allowCustomFormat: true,
    };
  },
};
