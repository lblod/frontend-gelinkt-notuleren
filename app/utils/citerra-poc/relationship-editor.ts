import type {
  EditorState,
  PNode,
  SayController,
} from '@lblod/ember-rdfa-editor';
import { RDF } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/constants';
import { unwrap } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import type {
  PredicateOption,
  PredicateOptionGenerator,
  ObjectOptionGenerator,
  SubjectOptionGenerator,
  TermOption,
  OptionGeneratorConfig,
} from '@lblod/ember-rdfa-editor/components/_private/relationship-editor/types';
import {
  isRdfaAttrs,
  type RdfaResourceAttrs,
} from '@lblod/ember-rdfa-editor/core/rdfa-types';
import {
  ResourceNodeTerm,
  sayDataFactory,
} from '@lblod/ember-rdfa-editor/core/say-data-factory';
import { rdfaInfoPluginKey } from '@lblod/ember-rdfa-editor/plugins/rdfa-info';
import type { Resource } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/namespace';
import { namespace } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/namespace';
import limitContent from '../../helpers/limit-content';

const M8G = namespace('http://data.europa.eu/m8g/', 'm8g');
const predicateOptionGenerator: PredicateOptionGenerator = ({
  searchString = '',
} = {}) => {
  const options: PredicateOption[] = [
    {
      label: 'Is voorwaarde van',
      term: sayDataFactory.namedNode(
        'http://data.europa.eu/m8g/isRequirementOf',
      ),
      direction: 'backlink',
    },
  ];
  return options.filter(
    (option) =>
      option.label?.toLowerCase().includes(searchString.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchString.toLowerCase()) ||
      option.term.value.toLowerCase().includes(searchString.toLowerCase()),
  );
};

const hasRdfType = (attrs: RdfaResourceAttrs, type: Resource) => {
  const rdfTypes = attrs.properties
    .filter((property) => RDF('type').matches(property.predicate))
    .map((prop) => prop.object);
  return rdfTypes.some((rdfType) => type.matches(rdfType.value));
};
type SubjectOptionMatcher = (
  node: PNode,
  state: EditorState,
) => TermOption<ResourceNodeTerm> | undefined;

const SUBJECT_OPTION_MATCHERS: SubjectOptionMatcher[] = [
  (node, _state) => {
    if (
      !isRdfaAttrs(node.attrs) ||
      !('subject' in node.attrs) ||
      !hasRdfType(node.attrs, M8G('Requirement'))
    ) {
      return;
    }
    return {
      label: 'Voorwaarde',
      description: limitContent(node.textContent, 50),
      term: sayDataFactory.resourceNode(node.attrs.subject),
    };
  },
];

const subjectOptionGenerator = (
  controller: SayController,
): SubjectOptionGenerator => {
  return ({ searchString = '' } = {}) => {
    const subjectMapping = rdfaInfoPluginKey.getState(
      controller.mainEditorState,
    )?.subjectMapping;
    if (!subjectMapping) {
      return [];
    }
    const options: TermOption<ResourceNodeTerm>[] = [];
    for (const [_subject, nodes] of subjectMapping.entries()) {
      const node = unwrap(nodes[0]).value;
      let option: TermOption<ResourceNodeTerm> | undefined;
      for (const optionMatcher of SUBJECT_OPTION_MATCHERS) {
        const match = optionMatcher(node, controller.mainEditorState);
        if (match) {
          option = match;
          break;
        }
      }
      if (option) {
        options.push(option);
      }
    }
    return options.filter(
      (option) =>
        option.label?.toLowerCase().includes(searchString.toLowerCase()) ||
        option.description
          ?.toLowerCase()
          .includes(searchString.toLowerCase()) ||
        option.term.value.toLowerCase().includes(searchString.toLowerCase()),
    );
  };
};

const objectOptionGenerator: ObjectOptionGenerator = ({
  searchString = '',
} = {}) => {
  // FIXME We should add object options but I don't know what we should expect
  const options: TermOption<ResourceNodeTerm>[] = [];
  return options.filter(
    (option) =>
      option.label?.toLowerCase().includes(searchString.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchString.toLowerCase()) ||
      option.term.value.toLowerCase().includes(searchString.toLowerCase()),
  );
};

export const relationshipEditorConfig: (
  controller: SayController,
) => OptionGeneratorConfig = (controller) => ({
  predicates: predicateOptionGenerator,
  subjects: subjectOptionGenerator(controller),
  objects: objectOptionGenerator,
});
