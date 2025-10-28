import Service from '@ember/service';
import { service } from '@ember/service';
import type { SayController } from '@lblod/ember-rdfa-editor';
import {
  transactionCombinator,
  type TransactionMonad,
} from '@lblod/ember-rdfa-editor/utils/transaction-utils';
import insertMeasure from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/roadsign-regulation-plugin/actions/insert-measure';
import { ZONALITY_OPTIONS } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/roadsign-regulation-plugin/constants';
import { getCurrentBesluitRange } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-topic-plugin/utils/helpers';
import type ArDesign from 'frontend-gelinkt-notuleren/models/ar-design';
import type AgendapointEditorService from 'frontend-gelinkt-notuleren/services/editor/agendapoint';
import type VariableModel from 'frontend-gelinkt-notuleren/models/variable';
import {
  VariableSchema,
  type Variable as PluginVariable,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/roadsign-regulation-plugin/schemas/variable';

type MeasureVariable = Exclude<PluginVariable, { type: 'instruction' }>;
type MeasureVariables = Record<string, MeasureVariable>;

function convertVariables(
  variables: VariableModel[] | undefined,
): MeasureVariables {
  if (!variables) return {};
  return Object.fromEntries<MeasureVariable>(
    // @ts-expect-error we filter instructions but TS doesn't see it...
    variables
      .map((variable): [string, PluginVariable] => [
        variable.title ?? '',
        VariableSchema.parse({
          uri: variable.uri ?? '',
          label: variable.title ?? '',
          type: variable.type ?? 'text',
        }),
      ])
      .filter(([_, variable]) => variable.type !== 'instruction'),
  );
}

export default class ArImporterService extends Service {
  @service('editor/agendapoint')
  declare agendapointEditor: AgendapointEditorService;

  async _generateInsertionMonads(
    design: ArDesign,
    decisionUri: string,
  ): Promise<TransactionMonad<boolean>[]> {
    const measures = await design.measures;
    const [measureVariables] = await Promise.all([
      Promise.all(measures.map((measure) => measure.variables)),
    ]);
    return measures.map((measure, i) => {
      return insertMeasure({
        measureConcept: {
          uri: measure.uri ?? 'test',
          label: measure.label ?? 'test',
          trafficSignalConcepts: [],
          // The remaining parts of this object aren't used
          preview: 'UNUSED',
          zonality: ZONALITY_OPTIONS.NON_ZONAL,
          variableSignage: false,
        },
        zonality: ZONALITY_OPTIONS.ZONAL,
        temporal: false,
        variables: convertVariables(measureVariables[i]),
        templateString: measure.templateString ?? 'broken',
        decisionUri,
      });
    });
  }

  async generatePreview(design: ArDesign): Promise<string> {
    const decisionUri = 'http://data.lblod.info/id/besluiten/12345';
    const monads = await this._generateInsertionMonads(design, decisionUri);
    const document = this.agendapointEditor.processDocumentHeadlessly(
      `<div property="prov:generated" resource="${decisionUri}" typeof="besluit:Besluit ext:BesluitNieuweStijl"><div property="prov:value" datatype="xsd:string"></div></div>`,
      (state) => transactionCombinator<boolean>(state)(monads),
    );
    return document;
  }

  async insertAr(controller: SayController, design: ArDesign): Promise<void> {
    const decisionRange = getCurrentBesluitRange(controller);
    const decisionUri = decisionRange?.node.attrs['subject'] as string;
    if (!decisionRange || typeof decisionUri !== 'string') {
      // TODO Show warning
      console.error('THIS SHOULD SHOW A WARNING');
      return;
    }
    const monads = await this._generateInsertionMonads(design, decisionUri);
    controller.withTransaction((tr) => {
      return transactionCombinator<boolean>(
        controller.mainEditorState,
        tr,
      )(monads).transaction;
    });
  }
}
