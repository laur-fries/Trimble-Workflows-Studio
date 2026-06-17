import {
  findWorkflowStarterById,
  type OperationItem,
  type WorkflowActionItem,
} from './data';
import { findWorkflowActionById } from './workflowActionLibrary';

export const WORKFLOW_GENERATION_PHASES = [
  { phase: 'thinking', durationMs: 2000, label: 'Thinking...', status: 'Analyzing your prompt...' },
  { phase: 'building', durationMs: 2400, label: 'Building...', status: 'Mapping triggers and actions...' },
  { phase: 'finalizing', durationMs: 1600, label: 'Finalizing...', status: 'Preparing your workflow canvas...' },
] as const;

export type WorkflowGenerationPhase = (typeof WORKFLOW_GENERATION_PHASES)[number]['phase'];

export const WORKFLOW_GENERATION_DELAY_MS = WORKFLOW_GENERATION_PHASES.reduce(
  (total, phase) => total + phase.durationMs,
  0,
);

export const WORKFLOW_SAMPLE_PROMPT =
  'When a BCF topic is created in Trimble Connect, email the project team and create a ProjectSight RFI';

export function getWorkflowGenerationPhaseLabel(phase: WorkflowGenerationPhase): string {
  return WORKFLOW_GENERATION_PHASES.find((entry) => entry.phase === phase)?.label ?? 'Thinking...';
}

export function getWorkflowGenerationPhaseStatus(phase: WorkflowGenerationPhase): string {
  return WORKFLOW_GENERATION_PHASES.find((entry) => entry.phase === phase)?.status ?? 'Analyzing your prompt...';
}

export function getWorkflowGenerationPhaseProgress(phase: WorkflowGenerationPhase): number {
  const phaseIndex = WORKFLOW_GENERATION_PHASES.findIndex((entry) => entry.phase === phase);
  if (phaseIndex < 0) {
    return 0;
  }

  return ((phaseIndex + 1) / WORKFLOW_GENERATION_PHASES.length) * 100;
}

export type WorkflowTriggerType =
  | 'FILE_CREATED'
  | 'FILE_UPLOADED'
  | 'FILE_UPDATED'
  | 'BCF_TOPIC_CREATED'
  | 'SCHEDULE_FRIDAY'
  | 'SCHEDULE_POLLING';

export type WorkflowActionType =
  | 'CONVERT_TFLX'
  | 'CONVERT_TRB'
  | 'CREATE_PROJECTSIGHT_RFI'
  | 'SEND_EMAIL_NOTIFICATION'
  | 'LOG_TO_VISTA';

export interface WorkflowStep {
  order: number;
  role: 'trigger' | 'action';
  type: WorkflowTriggerType | WorkflowActionType;
  provider: string;
  label: string;
  libraryId: string;
}

export interface WorkflowModel {
  title: string;
  prompt: string;
  steps: WorkflowStep[];
  generatedAt: string;
}

export interface GeneratedCanvasActionStep {
  instanceId: string;
  item: WorkflowActionItem;
}

export interface WorkflowCanvasState {
  title: string;
  starterStep: OperationItem | null;
  actionSteps: GeneratedCanvasActionStep[];
  selectedNodeId: string | null;
}

interface TriggerDefinition {
  type: WorkflowTriggerType;
  provider: string;
  label: string;
  libraryId: string;
  patterns: RegExp[];
}

interface ActionDefinition {
  type: WorkflowActionType;
  provider: string;
  label: string;
  libraryId: string;
  patterns: RegExp[];
}

const TRIGGER_DEFINITIONS: TriggerDefinition[] = [
  {
    type: 'BCF_TOPIC_CREATED',
    provider: 'TrimbleConnect',
    label: 'When a BCF topic is created',
    libraryId: 'starter-bcf-topic-created',
    patterns: [/bcf\s+topic/, /\bbcf\b/],
  },
  {
    type: 'FILE_UPDATED',
    provider: 'TrimbleConnect',
    label: 'When a file is updated',
    libraryId: 'starter-file-updated',
    patterns: [/file\s+(?:is\s+)?updated/, /updated\s+file/],
  },
  {
    type: 'FILE_UPLOADED',
    provider: 'TrimbleConnect',
    label: 'When a file is uploaded',
    libraryId: 'starter-file-created',
    patterns: [/file\s+(?:is\s+)?uploaded/, /uploaded\s+file/],
  },
  {
    type: 'FILE_CREATED',
    provider: 'TrimbleConnect',
    label: 'When a file is created',
    libraryId: 'starter-file-created',
    patterns: [/file\s+(?:is\s+)?created/, /created\s+file/, /new\s+file/],
  },
  {
    type: 'SCHEDULE_FRIDAY',
    provider: 'ProcessingFramework',
    label: 'Every Friday on a schedule',
    libraryId: 'starter-on-schedule',
    patterns: [/every\s+friday/, /on\s+friday/, /calendar\s+schedule/, /cron/],
  },
  {
    type: 'SCHEDULE_POLLING',
    provider: 'AppXchange',
    label: 'Interval data polling',
    libraryId: 'starter-polling-interval',
    patterns: [/polling/, /every\s+\d+\s+(?:minute|hour)/, /interval/],
  },
];

const ACTION_DEFINITIONS: ActionDefinition[] = [
  {
    type: 'SEND_EMAIL_NOTIFICATION',
    provider: 'Notifications',
    label: 'Send email notification',
    libraryId: 'pm-send-email',
    patterns: [/email/, /notify/, /notification/, /alert\s+team/],
  },
  {
    type: 'CREATE_PROJECTSIGHT_RFI',
    provider: 'ProjectSight',
    label: 'Create ProjectSight RFI',
    libraryId: 'pm-create-rfi',
    patterns: [/\brfi\b/, /projectsight/, /request\s+for\s+information/],
  },
  {
    type: 'CONVERT_TFLX',
    provider: 'TrimbleFieldLink',
    label: 'Convert to TFLX',
    libraryId: 'de-csv-tflx',
    patterns: [/\btflx\b/, /csv\s+to\s+tflx/],
  },
  {
    type: 'CONVERT_TRB',
    provider: 'TrimbleConnect',
    label: 'Convert to TRB',
    libraryId: 'de-nwd-trb',
    patterns: [/\btrb\b/, /nwd\s+to\s+trb/, /convert.*model/],
  },
  {
    type: 'LOG_TO_VISTA',
    provider: 'Vista',
    label: 'Log to Vista',
    libraryId: 'pm-log-vista',
    patterns: [/\bvista\b/, /log\s+to\s+vista/],
  },
];

function normalizePrompt(prompt: string): string {
  return prompt.toLowerCase().replace(/\s+/g, ' ').trim();
}

function findFirstMatchIndex(prompt: string, patterns: RegExp[]): number | null {
  let earliest: number | null = null;

  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match?.index !== undefined) {
      earliest = earliest === null ? match.index : Math.min(earliest, match.index);
    }
  }

  return earliest;
}

function parseTrigger(prompt: string): TriggerDefinition {
  let bestMatch: { definition: TriggerDefinition; index: number } | null = null;

  for (const definition of TRIGGER_DEFINITIONS) {
    const index = findFirstMatchIndex(prompt, definition.patterns);
    if (index === null) {
      continue;
    }

    if (!bestMatch || index < bestMatch.index) {
      bestMatch = { definition, index };
    }
  }

  return bestMatch?.definition ?? TRIGGER_DEFINITIONS[0];
}

function parseActions(prompt: string): ActionDefinition[] {
  const matches: { definition: ActionDefinition; index: number }[] = [];

  for (const definition of ACTION_DEFINITIONS) {
    const index = findFirstMatchIndex(prompt, definition.patterns);
    if (index === null) {
      continue;
    }

    matches.push({ definition, index });
  }

  matches.sort((left, right) => left.index - right.index);

  const seen = new Set<WorkflowActionType>();
  const ordered: ActionDefinition[] = [];

  for (const match of matches) {
    if (seen.has(match.definition.type)) {
      continue;
    }

    seen.add(match.definition.type);
    ordered.push(match.definition);
  }

  if (ordered.length > 0) {
    return ordered;
  }

  if (/bcf/.test(prompt)) {
    return [ACTION_DEFINITIONS[0], ACTION_DEFINITIONS[1]];
  }

  return [ACTION_DEFINITIONS[0]];
}

function buildWorkflowTitle(prompt: string, steps: WorkflowStep[]): string {
  const trigger = steps.find((step) => step.role === 'trigger');
  const actions = steps.filter((step) => step.role === 'action');

  if (trigger && actions.length > 0) {
    const actionSummary =
      actions.length === 1
        ? actions[0].label
        : `${actions[0].label} + ${actions.length - 1} more`;
    return `${trigger.label} → ${actionSummary}`;
  }

  const trimmed = prompt.trim();
  if (trimmed.length <= 64) {
    return trimmed;
  }

  return `${trimmed.slice(0, 61).trim()}...`;
}

function toWorkflowStep(
  definition: TriggerDefinition | ActionDefinition,
  role: WorkflowStep['role'],
  order: number,
): WorkflowStep {
  return {
    order,
    role,
    type: definition.type,
    provider: definition.provider,
    label: definition.label,
    libraryId: definition.libraryId,
  };
}

/** Mock parser engine: maps prompt keywords to trigger/action library steps. */
export function parsePromptToWorkflow(prompt: string): WorkflowModel {
  const normalizedPrompt = normalizePrompt(prompt);
  const trigger = parseTrigger(normalizedPrompt);
  const actions = parseActions(normalizedPrompt);

  const steps: WorkflowStep[] = [
    toWorkflowStep(trigger, 'trigger', 1),
    ...actions.map((action, index) => toWorkflowStep(action, 'action', index + 2)),
  ];

  return {
    title: buildWorkflowTitle(prompt, steps),
    prompt,
    steps,
    generatedAt: new Date().toISOString(),
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/** Simulates generative AI latency, then returns a structured workflow model. */
export async function generateWorkflow(
  prompt: string,
  onPhaseChange?: (phase: WorkflowGenerationPhase) => void,
): Promise<WorkflowModel> {
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) {
    throw new Error('A workflow prompt is required.');
  }

  for (const { phase, durationMs } of WORKFLOW_GENERATION_PHASES) {
    onPhaseChange?.(phase);
    await delay(durationMs);
  }

  return parsePromptToWorkflow(trimmedPrompt);
}

function createCanvasActionStep(item: WorkflowActionItem, index: number): GeneratedCanvasActionStep {
  return {
    instanceId: `action-step-${index}`,
    item,
  };
}

/** Converts a generated workflow model into canvas-ready state. */
export function toWorkflowCanvasState(model: WorkflowModel): WorkflowCanvasState {
  const triggerStep = model.steps.find((step) => step.role === 'trigger');
  const actionSteps = model.steps.filter((step) => step.role === 'action');

  const starterItem = triggerStep ? findWorkflowStarterById(triggerStep.libraryId) : undefined;
  const starterStep = starterItem ?? null;

  const placedActionSteps = actionSteps
    .map((step, index) => {
      const item = findWorkflowActionById(step.libraryId);
      if (!item) {
        return null;
      }

      return createCanvasActionStep(item, index);
    })
    .filter((step): step is GeneratedCanvasActionStep => step !== null);

  const selectedNodeId =
    placedActionSteps.length > 0
      ? placedActionSteps[placedActionSteps.length - 1].instanceId
      : starterStep?.id ?? null;

  return {
    title: model.title,
    starterStep,
    actionSteps: placedActionSteps,
    selectedNodeId,
  };
}

export type OnGenerateSuccess = (model: WorkflowModel) => void;

/** Runs generation and invokes the success callback with canvas-ready output. */
export async function runWorkflowGeneration(
  prompt: string,
  onGenerateSuccess: OnGenerateSuccess,
): Promise<WorkflowModel> {
  const model = await generateWorkflow(prompt);
  onGenerateSuccess(model);
  return model;
}
