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
  VariableInstanceSchema,
  type VariableInstance as PluginVariableInstance,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/roadsign-regulation-plugin/schemas/variable-instance';
import { TrafficSignalSchema } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/roadsign-regulation-plugin/schemas/traffic-signal';
import type ArDesign from 'frontend-gelinkt-notuleren/models/ar-design';
import type AgendapointEditorService from 'frontend-gelinkt-notuleren/services/editor/agendapoint';
import type TrafficSignal from 'frontend-gelinkt-notuleren/models/traffic-signal';
import type VariableInstance from 'frontend-gelinkt-notuleren/models/variable-instance';
import { v4 as uuidv4 } from 'uuid';

function convertVariableInstances(
  variableInstances: VariableInstance[],
): Record<string, PluginVariableInstance> {
  return Object.fromEntries<PluginVariableInstance>(
    variableInstances.map((varInstance) => [
      varInstance.variable.label,
      VariableInstanceSchema.parse({
        uri: varInstance.uri,
        value: varInstance.value,
        variable: {
          uri: varInstance.variable.uri,
          type: varInstance.variable.type,
          label: varInstance.variable.label,
          codelistUri: varInstance.variable.codelist,
        },
      }),
    ]),
  );
}

function convertSignals(signals: TrafficSignal[]) {
  return TrafficSignalSchema.array().parse(
    signals.map((signal) => {
      const { trafficSignalConcept } = signal;
      return {
        uri: signal.uri,
        trafficSignalConcept: {
          code: trafficSignalConcept.code,
          uri: trafficSignalConcept.uri,
          type: trafficSignalConcept.type,
          image: '',
        },
      };
    }),
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
      return measureDesigns.map((measureDesign) => {
        const { measureConcept, trafficSignals, variableInstances } =
          measureDesign;
        const convertedSignals = convertSignals(trafficSignals);
        const convertedVariableInstances =
          convertVariableInstances(variableInstances);
        return insertMeasure({
          measureDesign: {
            uri: measureDesign.uri,
            measureConcept: {
              uri: measureConcept.uri,
              label: measureConcept.label,
              preview: measureConcept.templateString,
              // TODO: provisory, we should change this
              zonality: ZONALITY_OPTIONS.NON_ZONAL,
              variableSignage: false,
              trafficSignalConcepts: convertedSignals.map(
                (signal) => signal.trafficSignalConcept,
              ),
            },
            trafficSignals: convertedSignals,
          },
          zonality: ZONALITY_OPTIONS.NON_ZONAL,
          temporal: false,
          variables: convertedVariableInstances,
          templateString: measureConcept.templateString,
          decisionUri,
          articleUriGenerator: () =>
            `http://data.lblod.info/artikels/${uuidv4()}`,
        });
      });
    } catch (err) {
      console.error('Error processing AR design relations', err);
      throw err;
    }
  }

  async generatePreview(design: ArDesign): Promise<string> {
    const decisionUri = 'http://data.lblod.info/id/besluiten/12345';
    console.log('Generate preview');
    const monads = await this._generateInsertionMonads(design, decisionUri);
    console.log('Monads: ', monads);
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
