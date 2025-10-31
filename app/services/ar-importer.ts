import Service from '@ember/service';
import { service } from '@ember/service';
import type IntlService from 'ember-intl/services/intl';
import { AlertTriangleIcon } from '@appuniversum/ember-appuniversum/components/icons/alert-triangle';
import type { SayController } from '@lblod/ember-rdfa-editor';
import {
  transactionCombinator,
  type TransactionMonad,
} from '@lblod/ember-rdfa-editor/utils/transaction-utils';
import {
  type Notification,
  notificationPluginKey,
} from '@lblod/ember-rdfa-editor/plugins/notification';
import insertMeasure from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/roadsign-regulation-plugin/actions/insert-measure';
import { ZONALITY_OPTIONS } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/roadsign-regulation-plugin/constants';
import { getCurrentBesluitRange } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/decision-utils';
import {
  VariableSchema,
  type Variable as PluginVariable,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/roadsign-regulation-plugin/schemas/variable';
import {
  TrafficSignalConceptSchema,
  type TrafficSignalConcept,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/roadsign-regulation-plugin/schemas/traffic-signal-concept';
import type ArDesign from 'frontend-gelinkt-notuleren/models/ar-design';
import type AgendapointEditorService from 'frontend-gelinkt-notuleren/services/editor/agendapoint';
import type TrafficSignal from 'frontend-gelinkt-notuleren/models/traffic-signal';

type MeasureVariable = Exclude<PluginVariable, { type: 'instruction' }>;
type MeasureVariables = Record<string, MeasureVariable>;

function convertVariables(trafficSignals: TrafficSignal[]): MeasureVariables {
  return Object.fromEntries<MeasureVariable>(
    // @ts-expect-error we filter instructions but TS doesn't see it...
    trafficSignals
      .flatMap((signal) => signal.variableInstances.map((vi) => vi.variable))
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

function convertSignals(signals: TrafficSignal[]): TrafficSignalConcept[] {
  return TrafficSignalConceptSchema.array().parse(
    signals.map((signal) => ({
      code: signal.trafficSignalConcept.code,
      uri: signal.trafficSignalConcept.uri,
      type: signal.trafficSignalConcept.type,
      image: '',
    })),
  );
}

export default class ArImporterService extends Service {
  @service('editor/agendapoint')
  declare agendapointEditor: AgendapointEditorService;

  _notifyError(controller: SayController, translationKey: string) {
    // Show a notification via the notification plugin
    const { notificationCallback, intl } = notificationPluginKey.getState(
      controller.mainEditorState,
    ) as {
      notificationCallback: (notification: Notification) => void;
      intl: IntlService;
    };
    notificationCallback({
      title: intl.t(translationKey),
      options: {
        type: 'error',
        icon: AlertTriangleIcon,
      },
    });
  }

  async _generateInsertionMonads(
    design: ArDesign,
    decisionUri: string,
  ): Promise<TransactionMonad<boolean>[]> {
    try {
      const measureDesigns = await design.measureDesigns;
      return measureDesigns.map(({ measureConcept, trafficSignals }) => {
        return insertMeasure({
          measureConcept: {
            uri: measureConcept.uri ?? 'test',
            label: measureConcept.label ?? 'test',
            trafficSignalConcepts: convertSignals(trafficSignals),
            // The remaining parts of this object aren't used
            preview: 'UNUSED',
            zonality: ZONALITY_OPTIONS.NON_ZONAL,
            variableSignage: false,
          },
          zonality: ZONALITY_OPTIONS.NON_ZONAL,
          temporal: false,
          variables: convertVariables(trafficSignals),
          templateString: measureConcept.templateString ?? 'broken',
          decisionUri,
        });
      });
    } catch (err) {
      console.error('Error processing AR design relations', err);
      throw err;
    }
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

  async insertAr(
    controller: SayController,
    design: ArDesign,
  ): Promise<boolean> {
    const decisionRange = getCurrentBesluitRange(controller);
    const decisionUri = decisionRange?.node.attrs['subject'] as string;
    if (!decisionRange || typeof decisionUri !== 'string') {
      this._notifyError(controller, 'ar-importer.message.error-no-decision');
      return false;
    }
    try {
      const monads = await this._generateInsertionMonads(design, decisionUri);
      controller.withTransaction((tr) => {
        return transactionCombinator<boolean>(
          controller.mainEditorState,
          tr,
        )(monads).transaction;
      });
      return true;
    } catch (_err) {
      this._notifyError(
        controller,
        'ar-importer.message.error-processing-design',
      );
      return false;
    }
  }
}
