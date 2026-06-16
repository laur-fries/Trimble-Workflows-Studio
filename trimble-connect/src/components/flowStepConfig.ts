import type { DiscoverFlow } from './FlowDetailView';

export type StepId = 'starter' | `action-${number}`;

export interface StepField {
  id: string;
  label: string;
  placeholder: string;
  helperText?: string;
}

export interface FlowStepDefinition {
  id: StepId;
  stepNumber: number;
  label: string;
  shortTitle: string;
  description: string;
  icon: string;
  fields: StepField[];
}

function getShortTitle(label: string): string {
  return label.replace(/^Step \d+:\s*/, '');
}

function isReadStep(label: string): boolean {
  return label.includes('Read from');
}

function isWriteStep(label: string): boolean {
  return label.includes('Write to');
}

function getActionDescription(label: string): string {
  if (label.includes('Convert')) {
    return 'Conversion runs automatically when a matching file is detected.';
  }
  if (label.includes('Write to')) {
    return 'Choose where output files should be saved in Trimble Connect.';
  }
  if (label.includes('Merge')) {
    return 'Merge runs automatically on the files from the source folder.';
  }
  return 'Configure this step to continue.';
}

export function getFlowSteps(flow: DiscoverFlow): FlowStepDefinition[] {
  return [
    {
      id: 'starter',
      stepNumber: 1,
      label: flow.starter.label,
      shortTitle: getShortTitle(flow.starter.label),
      description: 'Choose the Connect folder to watch for new files.',
      icon: flow.starter.icon,
      fields: isReadStep(flow.starter.label)
        ? [
            {
              id: 'sourceFolder',
              label: 'Source folder',
              placeholder: 'Select a folder',
              helperText: 'Files in this folder will trigger the workflow.',
            },
          ]
        : [],
    },
    ...flow.actions.map((action, index) => ({
      id: `action-${index}` as StepId,
      stepNumber: index + 2,
      label: action.label,
      shortTitle: getShortTitle(action.label),
      description: getActionDescription(action.label),
      icon: action.icon,
      fields: isWriteStep(action.label)
        ? [
            {
              id: 'destinationFolder',
              label: 'Destination folder',
              placeholder: 'Select a folder',
              helperText: 'Output files will be saved to this folder.',
            },
          ]
        : [],
    })),
  ];
}

export function isStepConfigured(
  step: FlowStepDefinition,
  values: Record<string, string>,
): boolean {
  if (step.fields.length === 0) {
    return true;
  }
  return step.fields.every((field) => Boolean(values[field.id]?.trim()));
}

export function getUnconfiguredStepIds(
  steps: FlowStepDefinition[],
  stepValues: Record<string, Record<string, string>>,
): StepId[] {
  return steps
    .filter((step) => step.fields.length > 0 && !isStepConfigured(step, stepValues[step.id] ?? {}))
    .map((step) => step.id);
}

export function getNextStepId(steps: FlowStepDefinition[], currentStepId: StepId): StepId | null {
  const currentIndex = steps.findIndex((step) => step.id === currentStepId);
  if (currentIndex === -1 || currentIndex >= steps.length - 1) {
    return null;
  }
  return steps[currentIndex + 1].id;
}
