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
import type MeasureConcept from 'frontend-gelinkt-notuleren/models/measure-concept';

export default class ArImporterService extends Service {
  @service('editor/agendapoint')
  declare agendapointEditor: AgendapointEditorService;

  _generateInsertionMonads(
    measures: MeasureConcept[],
    decisionUri: string,
  ): TransactionMonad<boolean>[] {
    return measures.map((measure) => {
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
        variables: {},
        templateString: measure.templateString ?? 'broken',
        decisionUri,
      });
    });
  }

  async generatePreview(design: ArDesign): Promise<string> {
    const measures = await design.measures;
    const decisionUri = 'http://data.lblod.info/id/besluiten/12345';
    const document = this.agendapointEditor.processDocumentHeadlessly(
      `<div property="prov:generated" resource="${decisionUri}" typeof="besluit:Besluit ext:BesluitNieuweStijl"><div property="prov:value" datatype="xsd:string"></div></div>`,
      (state) =>
        transactionCombinator<boolean>(state)(
          this._generateInsertionMonads(measures, decisionUri),
        ),
    );
    return document;
  }

  async insertAr(controller: SayController, design: ArDesign): Promise<void> {
    const measures = await design.measures;
    const decisionRange = getCurrentBesluitRange(controller);
    const decisionUri = decisionRange?.node.attrs['subject'] as string;
    if (!decisionRange || typeof decisionUri !== 'string') {
      // TODO Show warning
      console.error('THIS SHOULD SHOW A WARNING');
      return;
    }
    controller.withTransaction((tr) => {
      return transactionCombinator<boolean>(
        controller.mainEditorState,
        tr,
      )(this._generateInsertionMonads(measures, decisionUri)).transaction;
    });
  }
}
