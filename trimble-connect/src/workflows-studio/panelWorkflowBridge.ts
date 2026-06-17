import { findWorkflowStarterById, type OperationItem } from './data';
import { findWorkflowActionById } from './workflowActionLibrary';
import type { GeneratedCanvasActionStep } from './workflowGenerator';

type PanelStepValues = Record<string, Record<string, string>>;

interface PanelFlowStudioMapping {
  starterId: string;
  actionIds: string[];
}

const PANEL_FLOW_STUDIO_MAP: Record<string, PanelFlowStudioMapping> = {
  'csv-tflx': {
    starterId: 'starter-file-created',
    actionIds: ['de-csv-tflx', 'de-write-connect'],
  },
  'nwd-trb': {
    starterId: 'starter-file-created',
    actionIds: ['de-nwd-trb', 'de-write-connect'],
  },
  'merge-trb': {
    starterId: 'starter-file-created',
    actionIds: ['de-merge-trb', 'de-write-connect'],
  },
};

export interface PanelWorkflowCanvasPayload {
  title: string;
  starterStep: OperationItem | null;
  actionSteps: GeneratedCanvasActionStep[];
  stepConfigValues: Record<string, Record<string, string>>;
  selectedNodeId: string | null;
}

function createActionStep(item: NonNullable<ReturnType<typeof findWorkflowActionById>>, index: number) {
  return {
    instanceId: `action-step-${index}`,
    item,
  };
}

function mapPanelStepValuesToStudio(
  mapping: PanelFlowStudioMapping,
  panelStepValues: PanelStepValues,
): Record<string, Record<string, string>> {
  const studioValues: Record<string, Record<string, string>> = {};
  const starterValues = panelStepValues.starter ?? {};

  if (starterValues.sourceFolder?.trim()) {
    studioValues[mapping.starterId] = {
      watchFolder: starterValues.sourceFolder.trim(),
    };
  }

  mapping.actionIds.forEach((actionId, index) => {
    const panelValues = panelStepValues[`action-${index}`] ?? {};
    const instanceId = `action-step-${index}`;

    if (actionId === 'de-write-connect' && panelValues.destinationFolder?.trim()) {
      studioValues[instanceId] = {
        destinationFolder: panelValues.destinationFolder.trim(),
      };
    }
  });

  return studioValues;
}

export function buildPanelWorkflowCanvasPayload(
  flowId: string,
  title: string,
  panelStepValues: PanelStepValues,
): PanelWorkflowCanvasPayload | null {
  const mapping = PANEL_FLOW_STUDIO_MAP[flowId];
  if (!mapping) {
    return null;
  }

  const starterStep = findWorkflowStarterById(mapping.starterId) ?? null;
  const actionSteps = mapping.actionIds
    .map((actionId, index) => {
      const item = findWorkflowActionById(actionId);
      if (!item) {
        return null;
      }

      return createActionStep(item, index);
    })
    .filter((step): step is GeneratedCanvasActionStep => step !== null);

  const stepConfigValues = mapPanelStepValuesToStudio(mapping, panelStepValues);
  const selectedNodeId =
    actionSteps.length > 0
      ? actionSteps[actionSteps.length - 1].instanceId
      : starterStep?.id ?? null;

  return {
    title,
    starterStep,
    actionSteps,
    stepConfigValues,
    selectedNodeId,
  };
}
