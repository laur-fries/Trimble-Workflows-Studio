import type {
  OperationItem,
  StudioTemplate,
  StudioTemplateStep,
  WorkflowCanvasNode,
} from './data';
import type { PlacedActionStepRef } from './studioStepValidation';

export type StudioWorkflowStatus = 'active' | 'stopped';

export interface StudioSavedWorkflow {
  id: string;
  title: string;
  icons: readonly string[];
  status: StudioWorkflowStatus;
  savedAt: number;
  templateId?: string;
  templateSteps?: StudioTemplateStep[];
  starterStep: OperationItem | null;
  actionSteps: PlacedActionStepRef[];
  stepConfigValues: Record<string, Record<string, string>>;
}

export function createSavedWorkflowId(): string {
  return `workflow-${Date.now()}`;
}

function deriveWorkflowIcons(
  starterStep: OperationItem | null,
  actionSteps: PlacedActionStepRef[],
  template: StudioTemplate | null,
): string[] {
  if (template?.icons.length) {
    return [...template.icons].slice(0, 2);
  }

  const icons: string[] = [];

  if (starterStep?.icon) {
    icons.push(starterStep.icon);
  }

  actionSteps.forEach((step) => {
    if (step.item.icon && !icons.includes(step.item.icon)) {
      icons.push(step.item.icon);
    }
  });

  if (icons.length === 0) {
    return ['flowchart'];
  }

  return icons.slice(0, 2);
}

interface BuildSavedWorkflowParams {
  id: string;
  title: string;
  template: StudioTemplate | null;
  starterStep: OperationItem | null;
  actionSteps: PlacedActionStepRef[];
  canvasNodes: WorkflowCanvasNode[];
  isBlankWorkflow: boolean;
  stepConfigValues: Record<string, Record<string, string>>;
}

export function buildSavedWorkflow({
  id,
  title,
  template,
  starterStep,
  actionSteps,
  canvasNodes,
  isBlankWorkflow,
  stepConfigValues,
}: BuildSavedWorkflowParams): StudioSavedWorkflow {
  const trimmedTitle = title.trim() || 'Untitled Workflow';

  if (!isBlankWorkflow && template) {
    return {
      id,
      title: trimmedTitle,
      icons: deriveWorkflowIcons(null, [], template),
      status: 'active',
      savedAt: Date.now(),
      templateId: template.id,
      templateSteps: template.steps,
      starterStep: null,
      actionSteps: [],
      stepConfigValues: { ...stepConfigValues },
    };
  }

  if (!isBlankWorkflow && canvasNodes.length > 0) {
    const templateLikeSteps: StudioTemplateStep[] = canvasNodes.map((node, index) => ({
      stepId: node.id,
      label: node.label,
      icon: node.icon,
      isStarter: node.isStarter ?? index === 0,
    }));

    return {
      id,
      title: trimmedTitle,
      icons: deriveWorkflowIcons(starterStep, actionSteps, null),
      status: 'active',
      savedAt: Date.now(),
      templateSteps: templateLikeSteps,
      starterStep: null,
      actionSteps: [...actionSteps],
      stepConfigValues: { ...stepConfigValues },
    };
  }

  return {
    id,
    title: trimmedTitle,
    icons: deriveWorkflowIcons(starterStep, actionSteps, null),
    status: 'active',
    savedAt: Date.now(),
    starterStep,
    actionSteps: [...actionSteps],
    stepConfigValues: { ...stepConfigValues },
  };
}

export function findSavedWorkflowTemplate(
  templateId: string | undefined,
  groups: Array<{ templates: StudioTemplate[] }>,
): StudioTemplate | null {
  if (!templateId) {
    return null;
  }

  for (const group of groups) {
    const match = group.templates.find((template) => template.id === templateId);
    if (match) {
      return match;
    }
  }

  return null;
}
