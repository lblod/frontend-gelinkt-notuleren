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
import { TrafficSignalConceptSchema } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/roadsign-regulation-plugin/schemas/traffic-signal-concept';
import type ArDesign from 'frontend-gelinkt-notuleren/models/ar-design';
import type AgendapointEditorService from 'frontend-gelinkt-notuleren/services/editor/agendapoint';
import type TrafficSignal from 'frontend-gelinkt-notuleren/models/traffic-signal';
import type VariableInstance from 'frontend-gelinkt-notuleren/models/variable-instance';
import { v4 as uuidv4 } from 'uuid';

export type ImportResult<R> = {
  result: R;
  warnings: string[];
};
export type GenerateImportResult = ImportResult<TransactionMonad<boolean>[]>;

function convertVariableInstances(
  variableInstances: VariableInstance[],
): Record<string, PluginVariableInstance> {
  return Object.fromEntries<PluginVariableInstance>(
    variableInstances.map((varInstance) => {
      return [
        varInstance.variable.label,
        VariableInstanceSchema.parse({
          uri: varInstance.uri,
          value: varInstance.value,
          valueLabel: varInstance.valueLabel,
          variable: {
            source: varInstance.variable.source,
            uri: varInstance.variable.uri,
            type: varInstance.variable.type,
            label: varInstance.variable.label,
            codelistUri: varInstance.variable.codelist,
          },
        }),
      ];
    }),
  );
}

function convertSignals(signals: TrafficSignal[]) {
  const concepts = signals.map((s) => s.trafficSignalConcept);
  const conceptssWithoutZSign = concepts.filter(
    (concept) => concept.code !== 'Z',
  );
  const dedupedConcepts: typeof concepts = [];
  for (const concept of conceptssWithoutZSign) {
    if (!dedupedConcepts.find((c) => c.code === concept.code)) {
      dedupedConcepts.push(concept);
    }
  }

  return TrafficSignalConceptSchema.array().parse(
    dedupedConcepts.map((trafficSignalConcept) => {
      return {
        code: trafficSignalConcept.code,
        uri: trafficSignalConcept.uri,
        type: trafficSignalConcept.type,
        image: '',
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

  async generateInsertionMonads(
    decisionUriOrController: string | SayController,
    design: ArDesign,
  ): Promise<GenerateImportResult> {
    let decisionUri: string;
    if (typeof decisionUriOrController === 'string') {
      decisionUri = decisionUriOrController;
    } else {
      const decisionRange = getCurrentBesluitRange(decisionUriOrController);
      decisionUri = decisionRange?.node.attrs['subject'] as string;
      if (!decisionRange || typeof decisionUri !== 'string') {
        this._notifyError(
          decisionUriOrController,
          'ar-importer.message.error-no-decision',
        );
        return { result: [], warnings: [] };
      }
    }
    try {
      const warnings: string[] = [];
      const measureDesigns = await design.measureDesigns;
      const monads = measureDesigns.map((measureDesign) => {
        const {
          measureConcept,
          trafficSignals,
          variableInstances,
          unusedSignalConcepts,
          unIncludedSignalConcepts,
        } = measureDesign;
        warnings.push(
          ...unusedSignalConcepts.map(
            (unused) =>
              // FIXME intl
              `Measure concept '${measureConcept.label}' includes the signal concept '${unused.code}' but it is not used in this design`,
          ),
        );
        warnings.push(
          ...unIncludedSignalConcepts.map(
            (unIncluded) =>
              // FIXME intl
              `Signal concept '${unIncluded.code}' is not included in the measure concept '${measureConcept.label}' but it is used in this design`,
          ),
        );
        const filteredAndDeduplicatedConcepts = convertSignals(trafficSignals);
        const convertedVariableInstances =
          convertVariableInstances(variableInstances);
        const isZonal = Boolean(
          trafficSignals.find((s) => s.trafficSignalConcept.code === 'Z'),
        );
        const zonality = isZonal
          ? ZONALITY_OPTIONS.ZONAL
          : ZONALITY_OPTIONS.NON_ZONAL;
        return insertMeasure({
          arDesignUri: design.uri,
          measureDesign: {
            uri: measureDesign.uri,
            measureConcept: {
              uri: measureConcept.uri,
              label: measureConcept.label,
              preview: measureConcept.templateString,
              zonality,
              variableSignage: false,
              trafficSignalConcepts: filteredAndDeduplicatedConcepts,
            },
            trafficSignals: filteredAndDeduplicatedConcepts,
          },
          zonality,
          temporal: false,
          variables: convertedVariableInstances,
          templateString: measureConcept.templateString,
          decisionUri,
          articleUriGenerator: () =>
            `http://data.lblod.info/artikels/${uuidv4()}`,
        });
      });
      return {
        result: monads,
        warnings,
      };
    } catch (err) {
      console.error('Error processing AR design relations', err);
      throw err;
    }
  }

  async generatePreview(design: ArDesign): Promise<ImportResult<string>> {
    const decisionUri = 'http://data.lblod.info/id/besluiten/12345';
    const { result: monads, warnings } = await this.generateInsertionMonads(
      decisionUri,
      design,
    );
    const document = this.agendapointEditor.processDocumentHeadlessly(
      `<div property="prov:generated" resource="${decisionUri}" typeof="besluit:Besluit ext:BesluitNieuweStijl"><div property="prov:value" datatype="xsd:string"></div></div>`,
      (state) => transactionCombinator<boolean>(state)(monads),
    );
    return { result: document, warnings };
  }

  insertAr(
    controller: SayController,
    monads: TransactionMonad<boolean>[],
  ): boolean {
    try {
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
