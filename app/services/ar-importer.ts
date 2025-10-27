import Service from '@ember/service';
import { service } from '@ember/service';
import insertMeasure from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/roadsign-regulation-plugin/actions/insert-measure';
import { ZONALITY_OPTIONS } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/roadsign-regulation-plugin/constants';
import { transactionCombinator } from '@lblod/ember-rdfa-editor/utils/transaction-utils';
import type ArDesign from 'frontend-gelinkt-notuleren/models/ar-design';
import type AgendapointEditorService from 'frontend-gelinkt-notuleren/services/editor/agendapoint';

export default class ArImporterService extends Service {
  @service('editor/agendapoint')
  declare agendapointEditor: AgendapointEditorService;

  async generatePreview(design: ArDesign): Promise<string> {
    const measures = await design.measures;
    const decisionUri = 'http://data.lblod.info/id/besluiten/12345';
    const document = this.agendapointEditor.processDocumentHeadlessly(
      `<div property="prov:generated" resource="${decisionUri}" typeof="besluit:Besluit ext:BesluitNieuweStijl"><div property="prov:value" datatype="xsd:string"></div></div>`,
      (state) =>
        transactionCombinator<boolean>(state)(
          measures.map((measure) => {
            return insertMeasure({
              measureConcept: {
                uri: measure.uri ?? 'test',
                label: measure.label ?? 'test',
                preview: 'test',
                zonality: ZONALITY_OPTIONS.ZONAL,
                variableSignage: false,
                trafficSignalConcepts: [],
              },
              zonality: ZONALITY_OPTIONS.ZONAL,
              temporal: false,
              variables: {},
              templateString: measure.templateString ?? 'broken',
              decisionUri,
            });
          }),
        ),
    );
    return document;
  }
}
