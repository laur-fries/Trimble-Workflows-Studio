import { FLOW_STARTER_SLOT_ID, type OperationItem, type WorkflowActionItem, type WorkflowCanvasNode } from './data';
import { getStudioStepConfigFields } from './stepConfigFields';

export interface PlacedActionStepRef {
  instanceId: string;
  item: WorkflowActionItem;
}

export interface CanvasStepValidationTarget {
  nodeId: string;
  libraryStepId: string;
  isStarter: boolean;
}

export function isStudioStepConfigured(
  libraryStepId: string,
  isStarter: boolean,
  values: Record<string, string>,
): boolean {
  const fields = getStudioStepConfigFields(libraryStepId, isStarter);
  if (fields.length === 0) {
    return true;
  }

  return fields.every((field) => Boolean(values[field.id]?.trim()));
}

export function getCanvasValidationTargets(
  isBlankWorkflow: boolean,
  starterStep: OperationItem | null,
  actionSteps: PlacedActionStepRef[],
  canvasNodes: WorkflowCanvasNode[],
): CanvasStepValidationTarget[] {
  if (isBlankWorkflow) {
    const targets: CanvasStepValidationTarget[] = [];

    if (starterStep) {
      targets.push({
        nodeId: starterStep.id,
        libraryStepId: starterStep.id,
        isStarter: true,
      });
    } else {
      targets.push({
        nodeId: FLOW_STARTER_SLOT_ID,
        libraryStepId: '',
        isStarter: true,
      });
    }

    actionSteps.forEach((step) => {
      targets.push({
        nodeId: step.instanceId,
        libraryStepId: step.item.id,
        isStarter: false,
      });
    });

    return targets;
  }

  const targets = canvasNodes.map((node) => ({
    nodeId: node.id,
    libraryStepId: node.id,
    isStarter: Boolean(node.isStarter),
  }));

  actionSteps.forEach((step) => {
    targets.push({
      nodeId: step.instanceId,
      libraryStepId: step.item.id,
      isStarter: false,
    });
  });

  return targets;
}

export function getUnconfiguredCanvasStepIds(
  targets: CanvasStepValidationTarget[],
  stepConfigValues: Record<string, Record<string, string>>,
  hasStarterStep: boolean,
): string[] {
  return targets
    .filter((target) => {
      if (target.nodeId === FLOW_STARTER_SLOT_ID && !hasStarterStep) {
        return true;
      }

      if (!target.libraryStepId) {
        return false;
      }

      return !isStudioStepConfigured(
        target.libraryStepId,
        target.isStarter,
        stepConfigValues[target.nodeId] ?? {},
      );
    })
    .map((target) => target.nodeId);
}

export function getCanvasStepNavigationOrder(
  isBlankWorkflow: boolean,
  starterStep: OperationItem | null,
  actionSteps: PlacedActionStepRef[],
  canvasNodes: WorkflowCanvasNode[],
): string[] {
  if (isBlankWorkflow) {
    const order: string[] = [];

    if (starterStep) {
      order.push(starterStep.id);
    }

    actionSteps.forEach((step) => {
      order.push(step.instanceId);
    });

    return order;
  }

  const order = canvasNodes.map((node) => node.id);

  actionSteps.forEach((step) => {
    order.push(step.instanceId);
  });

  return order;
}

export function getNextCanvasStepNodeId(stepOrder: string[], currentNodeId: string): string | null {
  const currentIndex = stepOrder.findIndex((id) => id === currentNodeId);
  if (currentIndex === -1 || currentIndex >= stepOrder.length - 1) {
    return null;
  }

  return stepOrder[currentIndex + 1];
}
