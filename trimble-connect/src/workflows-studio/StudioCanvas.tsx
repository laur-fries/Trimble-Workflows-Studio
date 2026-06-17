import { useEffect, useMemo, useState } from 'react';
import {
  ModusWcBadge,
  ModusWcButton,
  ModusWcIcon,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';
import WorkflowsPrimaryButton from '../components/WorkflowsPrimaryButton';
import StudioChooseActionModal from './StudioChooseActionModal';
import StudioChooseStarterModal from './StudioChooseStarterModal';
import StudioCanvasPropertiesPanel from './StudioCanvasPropertiesPanel';
import StudioCanvasStepsPanel from './StudioCanvasStepsPanel';
import {
  FLOW_ACTION_SLOT_ID,
  FLOW_ADD_ACTION_STEP_ID,
  FLOW_STARTER_SLOT_ID,
  findWorkflowStarterById,
  type FlowCanvasSlot,
  type OperationItem,
  type StudioTemplate,
  type StudioTemplateStep,
  type WorkflowActionItem,
  type WorkflowCanvasNode,
} from './data';
import { findWorkflowActionById } from './workflowActionLibrary';
import { readActionDragId, isActionDrag, isStarterDrag, readStarterDragId } from './starterDrag';
import { getStudioStepConfigFields } from './stepConfigFields';

export interface PlacedActionStep {
  instanceId: string;
  item: WorkflowActionItem;
}

function createPlacedActionStep(item: WorkflowActionItem, index: number): PlacedActionStep {
  return {
    instanceId: `action-step-${index}`,
    item,
  };
}

type DropZoneHighlight = 'none' | 'valid' | 'invalid';

type ActionDropTarget = 'append' | { replaceStepId: string };

function resolveNextActionSteps(
  current: PlacedActionStep[],
  item: WorkflowActionItem,
  selectedNodeId: string | null,
  dropTarget?: ActionDropTarget,
): { steps: PlacedActionStep[]; selectedId: string } {
  if (current.length === 0) {
    const steps = [createPlacedActionStep(item, 0)];
    return { steps, selectedId: steps[0].instanceId };
  }

  if (dropTarget === 'append') {
    const newStep = createPlacedActionStep(item, current.length);
    return { steps: [...current, newStep], selectedId: newStep.instanceId };
  }

  if (dropTarget && 'replaceStepId' in dropTarget) {
    const replaceIndex = current.findIndex((step) => step.instanceId === dropTarget.replaceStepId);
    if (replaceIndex >= 0) {
      const steps = [...current];
      steps[replaceIndex] = createPlacedActionStep(item, replaceIndex);
      return { steps, selectedId: steps[replaceIndex].instanceId };
    }
  }

  if (selectedNodeId === FLOW_ADD_ACTION_STEP_ID || selectedNodeId === FLOW_ACTION_SLOT_ID) {
    const newStep = createPlacedActionStep(item, current.length);
    return { steps: [...current, newStep], selectedId: newStep.instanceId };
  }

  const selectedIndex = current.findIndex((step) => step.instanceId === selectedNodeId);
  if (selectedIndex >= 0) {
    const steps = [...current];
    steps[selectedIndex] = createPlacedActionStep(item, selectedIndex);
    return { steps, selectedId: steps[selectedIndex].instanceId };
  }

  const newStep = createPlacedActionStep(item, current.length);
  return { steps: [...current, newStep], selectedId: newStep.instanceId };
}

function getPlacedActionNodeClasses(
  step: PlacedActionStep,
  selectedNodeId: string | null,
  activeFlowSlot: FlowCanvasSlot,
  dropHighlight: DropZoneHighlight,
): string {
  return [
    'studio-canvas-starter-node',
    'studio-canvas-action-node',
    activeFlowSlot === 'action' ? 'is-flow-active' : '',
    selectedNodeId === step.instanceId ? 'is-node-selected' : '',
    dropHighlight === 'valid' ? 'is-drop-zone-valid' : '',
    dropHighlight === 'invalid' ? 'is-drop-zone-invalid' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

export type StudioCanvasMode = 'edit' | 'preview' | 'cloned';

interface StudioCanvasProps {
  template: StudioTemplate | null;
  highlightStartNode?: boolean;
  assistantPrompt?: string;
  canvasMode?: StudioCanvasMode;
  onBack?: () => void;
  onCloneTemplate?: () => void;
}

function resetDropHighlightIfLeaving(
  event: React.DragEvent<HTMLElement>,
  onReset: () => void,
) {
  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
    onReset();
  }
}

function BrowseHint({
  onBrowse,
}: {
  onBrowse: (event: React.MouseEvent | React.KeyboardEvent) => void;
}) {
  return (
    <>
      Drag from the Steps library or{' '}
      <span
        role="button"
        tabIndex={0}
        className="studio-canvas-empty-link"
        onClick={(event) => {
          event.stopPropagation();
          onBrowse(event);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            onBrowse(event);
          }
        }}
      >
        click to browse
      </span>
    </>
  );
}

function resolveTemplateStepNode(step: StudioTemplateStep, index: number): WorkflowCanvasNode {
  const starter = findWorkflowStarterById(step.stepId);
  const action = findWorkflowActionById(step.stepId);

  return {
    id: step.stepId,
    label: step.label,
    icon: step.icon ?? starter?.icon ?? action?.icon ?? (index === 0 ? 'play_circle' : 'flowchart'),
    isStarter: step.isStarter ?? index === 0,
  };
}

export default function StudioCanvas({
  template,
  highlightStartNode = false,
  assistantPrompt = '',
  canvasMode = 'edit',
  onBack,
  onCloneTemplate,
}: StudioCanvasProps) {
  const [workflowTitle, setWorkflowTitle] = useState(template?.title ?? 'Untitled Workflow');
  const [stepsPanelOpen, setStepsPanelOpen] = useState(true);
  const [propertiesPanelOpen, setPropertiesPanelOpen] = useState(false);
  const [activeFlowSlot, setActiveFlowSlot] = useState<FlowCanvasSlot>('starter');
  const [starterStep, setStarterStep] = useState<OperationItem | null>(null);
  const [actionSteps, setActionSteps] = useState<PlacedActionStep[]>([]);
  const [starterBrowseOpen, setStarterBrowseOpen] = useState(false);
  const [actionBrowseOpen, setActionBrowseOpen] = useState(false);
  const [starterDropHighlight, setStarterDropHighlight] = useState<DropZoneHighlight>('none');
  const [actionDropHighlight, setActionDropHighlight] = useState<DropZoneHighlight>('none');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(FLOW_STARTER_SLOT_ID);
  const [panelHighlightedActionId, setPanelHighlightedActionId] = useState<string | null>(null);
  const [panelHighlightedStarterId, setPanelHighlightedStarterId] = useState<string | null>(null);
  const [stepConfigValues, setStepConfigValues] = useState<Record<string, Record<string, string>>>({});
  const isReadOnlyCanvas = canvasMode === 'preview';
  const showConfigurationRequired = canvasMode === 'cloned';
  const configurationRequiredStepIds = template?.configurationRequiredStepIds ?? [];

  useEffect(() => {
    if (highlightStartNode) {
      setActiveFlowSlot('starter');
    }
  }, [highlightStartNode]);

  useEffect(() => {
    if (!template?.steps.length) {
      return;
    }

    const firstStep = resolveTemplateStepNode(template.steps[0], 0);
    setWorkflowTitle(template.title);
    setSelectedNodeId(firstStep.id);
    setPropertiesPanelOpen(true);
  }, [template?.id, template?.steps, template?.title]);

  useEffect(() => {
    const resetDropHighlights = () => {
      setStarterDropHighlight('none');
      setActionDropHighlight('none');
    };

    window.addEventListener('dragend', resetDropHighlights);
    return () => window.removeEventListener('dragend', resetDropHighlights);
  }, []);

  const templateSteps = template?.steps ?? [];
  const isBlankWorkflow = templateSteps.length === 0;
  const useCenteredStarterCanvas = isBlankWorkflow;
  const hasStarterStep = Boolean(starterStep);
  const hasActionStep = actionSteps.length > 0;
  const selectedPlacedAction = actionSteps.find((step) => step.instanceId === selectedNodeId) ?? null;

  useEffect(() => {
    if (selectedPlacedAction) {
      setPanelHighlightedActionId(selectedPlacedAction.item.id);
    }
  }, [selectedPlacedAction?.instanceId, selectedPlacedAction?.item.id]);

  const canvasNodes = useMemo<WorkflowCanvasNode[]>(() => {
    if (templateSteps.length === 0) {
      return [];
    }

    return templateSteps.map((step, index) => resolveTemplateStepNode(step, index));
  }, [templateSteps]);

  const templateActionStepCount = useMemo(
    () => canvasNodes.filter((node) => !node.isStarter).length,
    [canvasNodes],
  );
  const showAddStepGhostInTemplate = !isReadOnlyCanvas && !isBlankWorkflow && templateActionStepCount > 0;

  const propertiesNode = useMemo<WorkflowCanvasNode | null>(() => {
    if (!isBlankWorkflow) {
      if (selectedPlacedAction) {
        return {
          id: selectedPlacedAction.instanceId,
          label: selectedPlacedAction.item.label,
          icon: selectedPlacedAction.item.icon,
          isStarter: false,
        };
      }

      return canvasNodes.find((node) => node.id === selectedNodeId) ?? null;
    }

    if (starterStep && selectedNodeId === starterStep.id) {
      return {
        id: starterStep.id,
        label: starterStep.label,
        icon: starterStep.icon,
        isStarter: true,
      };
    }

    if (selectedPlacedAction) {
      return {
        id: selectedPlacedAction.instanceId,
        label: selectedPlacedAction.item.label,
        icon: selectedPlacedAction.item.icon,
        isStarter: false,
      };
    }

    return null;
  }, [actionSteps, canvasNodes, isBlankWorkflow, selectedNodeId, selectedPlacedAction, starterStep]);

  const propertiesConfigFields = useMemo(() => {
    if (!propertiesNode) {
      return [];
    }

    if (!isBlankWorkflow) {
      if (selectedPlacedAction) {
        return getStudioStepConfigFields(selectedPlacedAction.item.id, false);
      }

      return getStudioStepConfigFields(propertiesNode.id, Boolean(propertiesNode.isStarter));
    }

    if (starterStep && selectedNodeId === starterStep.id) {
      return getStudioStepConfigFields(starterStep.id, true);
    }

    if (selectedPlacedAction) {
      return getStudioStepConfigFields(selectedPlacedAction.item.id, false);
    }

    return [];
  }, [isBlankWorkflow, propertiesNode, selectedNodeId, selectedPlacedAction, starterStep]);
  const propertiesConfigValues = propertiesNode
    ? (stepConfigValues[propertiesNode.id] ?? {})
    : {};
  const showPropertiesPanel = propertiesPanelOpen && propertiesNode !== null;

  const focusStarterSlot = () => {
    setActiveFlowSlot('starter');
    if (starterStep) {
      setSelectedNodeId(starterStep.id);
      setPropertiesPanelOpen(true);
      return;
    }

    setSelectedNodeId(FLOW_STARTER_SLOT_ID);
    setPropertiesPanelOpen(false);
  };

  const focusActionSlot = () => {
    setActiveFlowSlot('action');
    if (actionSteps.length === 0) {
      setSelectedNodeId(FLOW_ACTION_SLOT_ID);
      setPropertiesPanelOpen(false);
      return;
    }

    const lastStep = actionSteps[actionSteps.length - 1];
    setSelectedNodeId(lastStep.instanceId);
    setPropertiesPanelOpen(true);
  };

  const focusPlacedActionStep = (step: PlacedActionStep) => {
    setActiveFlowSlot('action');
    setSelectedNodeId(step.instanceId);
    setPropertiesPanelOpen(true);
  };

  const focusAddActionStep = () => {
    setActiveFlowSlot('action');
    setSelectedNodeId(FLOW_ADD_ACTION_STEP_ID);
    setPropertiesPanelOpen(false);
  };

  const handleAddStepClick = () => {
    focusAddActionStep();
    setActionBrowseOpen(true);
  };

  const handleSelectStarter = (item: OperationItem) => {
    setStarterStep(item);
    setPanelHighlightedStarterId(item.id);
    setActiveFlowSlot('action');
    setSelectedNodeId(item.id);
    setPropertiesPanelOpen(true);
  };

  const handlePanelStarterClick = (item: OperationItem) => {
    setPanelHighlightedStarterId(item.id);
  };

  const placeActionOnCanvas = (item: WorkflowActionItem, dropTarget?: ActionDropTarget) => {
    const { steps, selectedId } = resolveNextActionSteps(actionSteps, item, selectedNodeId, dropTarget);
    setActionSteps(steps);
    setActiveFlowSlot('action');
    setSelectedNodeId(selectedId);
    setPropertiesPanelOpen(true);
    setPanelHighlightedActionId(item.id);
  };

  const handlePanelActionClick = (item: WorkflowActionItem) => {
    setPanelHighlightedActionId(item.id);
  };

  const handleSelectNode = (node: WorkflowCanvasNode) => {
    setSelectedNodeId(node.id);
    setPropertiesPanelOpen(true);
  };

  const handleConfigChange = (fieldId: string, value: string) => {
    if (!propertiesNode) {
      return;
    }

    setStepConfigValues((current) => ({
      ...current,
      [propertiesNode.id]: {
        ...(current[propertiesNode.id] ?? {}),
        [fieldId]: value,
      },
    }));
  };

  const handleStarterDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setStarterDropHighlight('none');

    const starterId = readStarterDragId(event);
    if (!starterId) {
      return;
    }

    const item = findWorkflowStarterById(starterId);
    if (item) {
      handleSelectStarter(item);
    }
  };

  const handleActionDrop = (
    event: React.DragEvent<HTMLElement>,
    dropTarget?: ActionDropTarget,
  ) => {
    event.preventDefault();
    setActionDropHighlight('none');

    const actionId = readActionDragId(event);
    if (!actionId) {
      return;
    }

    const item = findWorkflowActionById(actionId);
    if (item) {
      placeActionOnCanvas(item, dropTarget);
    }
  };

  const handleStarterSectionDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (isStarterDrag(event)) {
      event.dataTransfer.dropEffect = 'copy';
      setStarterDropHighlight('valid');
      setActionDropHighlight('none');
      return;
    }

    if (isActionDrag(event)) {
      event.dataTransfer.dropEffect = 'none';
      setStarterDropHighlight('invalid');
      setActionDropHighlight('none');
    }
  };

  const handleActionSectionDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();

    if (isActionDrag(event)) {
      event.dataTransfer.dropEffect = 'copy';
      setActionDropHighlight('valid');
      setStarterDropHighlight('none');
      return;
    }

    if (isStarterDrag(event)) {
      event.dataTransfer.dropEffect = 'none';
      setActionDropHighlight('invalid');
      setStarterDropHighlight('none');
    }
  };

  const starterSectionClasses = [
    'studio-canvas-flow-section',
    'studio-canvas-flow-section--starter',
    starterDropHighlight === 'valid' ? 'is-drop-zone-valid' : '',
    starterDropHighlight === 'invalid' ? 'is-drop-zone-invalid' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const actionSectionClasses = [
    'studio-canvas-flow-section',
    'studio-canvas-flow-section--actions',
    actionDropHighlight === 'valid' ? 'is-drop-zone-valid' : '',
    actionDropHighlight === 'invalid' ? 'is-drop-zone-invalid' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const starterNodeClasses = [
    'studio-canvas-starter-node',
    activeFlowSlot === 'starter' ? 'is-flow-active' : '',
    starterStep && selectedNodeId === starterStep.id ? 'is-node-selected' : '',
    starterDropHighlight === 'valid' ? 'is-drop-zone-valid' : '',
    starterDropHighlight === 'invalid' ? 'is-drop-zone-invalid' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const actionNodeClasses = [
    'studio-canvas-starter-node',
    'studio-canvas-action-node',
    activeFlowSlot === 'action' ? 'is-flow-active' : '',
    selectedNodeId === FLOW_ACTION_SLOT_ID ? 'is-node-selected' : '',
    actionDropHighlight === 'valid' ? 'is-drop-zone-valid' : '',
    actionDropHighlight === 'invalid' ? 'is-drop-zone-invalid' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const addStepGhostClasses = [
    'studio-canvas-add-step-ghost',
    selectedNodeId === FLOW_ADD_ACTION_STEP_ID ? 'is-selected' : '',
    actionDropHighlight === 'valid' ? 'is-drop-zone-valid' : '',
    actionDropHighlight === 'invalid' ? 'is-drop-zone-invalid' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const renderActionDropMessage = () => {
    if (actionDropHighlight === 'none') {
      return null;
    }

    return (
      <p
        className={`studio-canvas-drop-zone-message${
          actionDropHighlight === 'invalid'
            ? ' studio-canvas-drop-zone-message--invalid'
            : ' studio-canvas-drop-zone-message--valid'
        }`}
      >
        {actionDropHighlight === 'valid'
          ? 'Drop action here'
          : 'Triggers belong in the Starting step section above'}
      </p>
    );
  };

  const renderAddStepGhost = (layout: 'flow' | 'stack' = 'flow') =>
    layout === 'stack' ? (
      <div className="studio-canvas-node-item studio-canvas-node-item--add-step">
        <span className="studio-canvas-node-connector" aria-hidden="true" />
        <div className="studio-canvas-node-stack-add-step">
          <button
            type="button"
            className={addStepGhostClasses}
            onClick={handleAddStepClick}
            onDragOver={handleActionSectionDragOver}
            onDrop={(event) => handleActionDrop(event, 'append')}
          >
            {renderActionDropMessage()}
            <ModusWcIcon decorative name="add" size="sm" />
            Add step
          </button>
        </div>
      </div>
    ) : (
      <button
        type="button"
        className={addStepGhostClasses}
        onClick={handleAddStepClick}
        onDragOver={handleActionSectionDragOver}
        onDrop={(event) => handleActionDrop(event, 'append')}
      >
        {renderActionDropMessage()}
        <ModusWcIcon decorative name="add" size="sm" />
        Add step
      </button>
    );

  return (
    <div className="studio-canvas-editor">
      <header className="studio-canvas-toolbar">
        <div className="studio-canvas-toolbar-start">
          <ModusWcButton
            color="tertiary"
            customClass="studio-canvas-toolbar-back"
            onButtonClick={onBack}
            size="sm"
            variant="borderless"
          >
            <ModusWcIcon decorative name="caret_left" size="sm" />
            Back
          </ModusWcButton>

          <div className="studio-canvas-title-group">
            <ModusWcTypography hierarchy="h4" weight="semibold" customClass="studio-canvas-title">
              {workflowTitle}
            </ModusWcTypography>
            {!isReadOnlyCanvas && (
              <ModusWcButton
                aria-label="Edit workflow name"
                color="tertiary"
                onButtonClick={() => {
                  const nextTitle = window.prompt('Workflow name', workflowTitle);
                  if (nextTitle?.trim()) {
                    setWorkflowTitle(nextTitle.trim());
                  }
                }}
                shape="square"
                size="sm"
                variant="borderless"
              >
                <ModusWcIcon decorative name="pencil" size="sm" />
              </ModusWcButton>
            )}
            <ModusWcBadge color="primary" size="sm" variant="filled" customClass="studio-canvas-version-badge">
              {template?.version ?? 'v0.1 Draft'}
            </ModusWcBadge>
          </div>
        </div>

        {!isReadOnlyCanvas && (
          <div className="studio-canvas-toolbar-actions">
            <ModusWcButton color="tertiary" disabled size="sm" variant="outlined">
              <ModusWcIcon decorative name="play_circle" size="sm" variant="solid" />
              Test Run
            </ModusWcButton>
            <WorkflowsPrimaryButton onClick={() => undefined}>Save</WorkflowsPrimaryButton>
            <ModusWcButton
              aria-label="More actions"
              color="tertiary"
              shape="square"
              size="sm"
              variant="borderless"
            >
              <ModusWcIcon decorative name="more_vertical" size="sm" />
            </ModusWcButton>
          </div>
        )}
      </header>

      {isReadOnlyCanvas && (
        <div className="studio-canvas-preview-banner">
          <div className="studio-canvas-preview-banner-copy">
            <ModusWcIcon decorative name="visibility" size="sm" />
            <p>Read-only preview. Workflow configurations are locked and editor actions are hidden.</p>
          </div>
          <ModusWcButton color="primary" size="sm" variant="filled" onButtonClick={onCloneTemplate}>
            Clone to My Workflows
          </ModusWcButton>
        </div>
      )}

      <div className="studio-canvas-body">
        {!isReadOnlyCanvas && !stepsPanelOpen && (
          <ModusWcButton
            color="tertiary"
            customClass="studio-canvas-rail-tab studio-canvas-rail-tab--left"
            onButtonClick={() => setStepsPanelOpen(true)}
            size="sm"
            variant="borderless"
          >
            <ModusWcIcon decorative name="caret_right" size="sm" />
            Steps
          </ModusWcButton>
        )}

        {!isReadOnlyCanvas && stepsPanelOpen && (
          <StudioCanvasStepsPanel
            panelMode={activeFlowSlot === 'starter' ? 'starter' : 'actions'}
            selectedActionId={panelHighlightedActionId}
            selectedStarterId={panelHighlightedStarterId}
            onCollapse={() => setStepsPanelOpen(false)}
            onSelectAction={handlePanelActionClick}
            onSelectStarter={handlePanelStarterClick}
          />
        )}

        <section className="studio-canvas-workspace" aria-label="Workflow canvas">
          {assistantPrompt && (
            <p className="studio-canvas-assistant-banner">
              Trimble Assistant: {assistantPrompt}
            </p>
          )}

          <div className="studio-canvas-main">
            <div className="studio-canvas-grid studio-canvas-grid--centered">
              {useCenteredStarterCanvas ? (
                <div className="studio-canvas-flow">
                  <div
                    className={starterSectionClasses}
                    onDragLeave={(event) => {
                      resetDropHighlightIfLeaving(event, () => setStarterDropHighlight('none'));
                    }}
                    onDragOver={handleStarterSectionDragOver}
                  >
                    <span className="studio-canvas-flow-section-label">Starting step</span>
                    <div
                      className={starterNodeClasses}
                      role="button"
                      tabIndex={0}
                      onClick={focusStarterSlot}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          focusStarterSlot();
                        }
                      }}
                      onDrop={handleStarterDrop}
                    >
                      {starterDropHighlight !== 'none' && (
                        <p
                          className={`studio-canvas-drop-zone-message${
                            starterDropHighlight === 'invalid'
                              ? ' studio-canvas-drop-zone-message--invalid'
                              : ' studio-canvas-drop-zone-message--valid'
                          }`}
                        >
                          {starterDropHighlight === 'valid'
                            ? 'Drop trigger here'
                            : 'Actions belong in the Actions section below'}
                        </p>
                      )}
                      <ModusWcIcon
                        decorative
                        name={starterStep?.icon ?? 'library_add'}
                        size="md"
                        variant="solid"
                        customClass="studio-canvas-starter-node-icon"
                      />
                      <div className="studio-canvas-starter-node-copy">
                        <p className="studio-canvas-starter-node-title">
                          {starterStep?.label ?? 'Choose a starter'}
                        </p>
                        <p className="studio-canvas-starter-node-hint">
                          {hasStarterStep
                            ? 'Selected trigger. Choose the next action below.'
                            : activeFlowSlot === 'starter' && (
                              <BrowseHint onBrowse={() => setStarterBrowseOpen(true)} />
                            )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <span className="studio-canvas-flow-connector" aria-hidden="true" />

                  <div
                    className={actionSectionClasses}
                    onDragLeave={(event) => {
                      resetDropHighlightIfLeaving(event, () => setActionDropHighlight('none'));
                    }}
                    onDragOver={handleActionSectionDragOver}
                  >
                    <span className="studio-canvas-flow-section-label">Actions</span>
                    {hasActionStep ? (
                      <div className="studio-canvas-action-steps">
                        {actionSteps.map((step, index) => (
                          <div key={step.instanceId} className="studio-canvas-action-step-item">
                            {index > 0 && (
                              <span className="studio-canvas-flow-connector" aria-hidden="true" />
                            )}
                            <div
                              className={getPlacedActionNodeClasses(
                                step,
                                selectedNodeId,
                                activeFlowSlot,
                                'none',
                              )}
                              role="button"
                              tabIndex={0}
                              onClick={() => focusPlacedActionStep(step)}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault();
                                  focusPlacedActionStep(step);
                                }
                              }}
                              onDrop={(event) =>
                                handleActionDrop(event, { replaceStepId: step.instanceId })
                              }
                            >
                              {renderActionDropMessage()}
                              <ModusWcIcon
                                decorative
                                name={step.item.icon}
                                size="md"
                                variant="solid"
                                customClass="studio-canvas-starter-node-icon"
                              />
                              <div className="studio-canvas-starter-node-copy">
                                <p className="studio-canvas-starter-node-title">
                                  Step {index + 1}: {step.item.label}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}

                        <span className="studio-canvas-flow-connector" aria-hidden="true" />

                        {renderAddStepGhost('flow')}
                      </div>
                    ) : (
                      <div
                        className={actionNodeClasses}
                        role="button"
                        tabIndex={0}
                        onClick={focusActionSlot}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            focusActionSlot();
                          }
                        }}
                        onDrop={handleActionDrop}
                      >
                        {renderActionDropMessage()}
                        <ModusWcIcon
                          decorative
                          name="library_add"
                          size="md"
                          variant="solid"
                          customClass="studio-canvas-starter-node-icon"
                        />
                        <div className="studio-canvas-starter-node-copy">
                          <p className="studio-canvas-starter-node-title">Choose a step</p>
                          <p className="studio-canvas-starter-node-hint">
                            {activeFlowSlot === 'action' && (
                              <BrowseHint onBrowse={() => setActionBrowseOpen(true)} />
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="studio-canvas-node-stack">
                  {canvasNodes.map((node, index) => (
                    <div key={node.id} className="studio-canvas-node-item">
                      {index > 0 && <span className="studio-canvas-node-connector" aria-hidden="true" />}
                      <button
                        type="button"
                        className={`studio-canvas-node ${node.isStarter ? 'is-starter' : ''}${
                          selectedNodeId === node.id ? ' is-node-selected' : ''
                        }`}
                        onClick={() => handleSelectNode(node)}
                      >
                        {node.isStarter ? (
                          <ModusWcIcon decorative name={node.icon} size="sm" variant="solid" />
                        ) : (
                          <span className="studio-canvas-node-index">{index + 1}</span>
                        )}
                        <div className="studio-canvas-node-copy">
                          <p>{node.label}</p>
                          {showConfigurationRequired && configurationRequiredStepIds.includes(node.id) && (
                            <span className="studio-config-required-tag">Configuration Required</span>
                          )}
                        </div>
                      </button>
                    </div>
                  ))}

                  {actionSteps.map((step, index) => (
                    <div key={step.instanceId} className="studio-canvas-node-item">
                      <span className="studio-canvas-node-connector" aria-hidden="true" />
                      <button
                        type="button"
                        className={`studio-canvas-node${
                          selectedNodeId === step.instanceId ? ' is-node-selected' : ''
                        }`}
                        onClick={() => focusPlacedActionStep(step)}
                      >
                        <span className="studio-canvas-node-index">
                          {templateActionStepCount + index + 1}
                        </span>
                        <p>{step.item.label}</p>
                      </button>
                    </div>
                  ))}

                  {showAddStepGhostInTemplate && renderAddStepGhost('stack')}
                </div>
              )}
            </div>

            <div className="studio-canvas-zoom-controls" aria-label="Canvas controls">
              <ModusWcButton aria-label="Zoom in" color="tertiary" shape="square" size="sm" variant="outlined">
                <ModusWcIcon decorative name="add" size="sm" />
              </ModusWcButton>
              <ModusWcButton aria-label="Zoom out" color="tertiary" shape="square" size="sm" variant="outlined">
                <ModusWcIcon decorative name="remove" size="sm" />
              </ModusWcButton>
              <ModusWcButton aria-label="Fit canvas" color="tertiary" shape="square" size="sm" variant="outlined">
                <ModusWcIcon decorative name="fullscreen" size="sm" />
              </ModusWcButton>
              <ModusWcButton aria-label="Lock canvas" color="tertiary" shape="square" size="sm" variant="outlined">
                <ModusWcIcon decorative name="lock" size="sm" />
              </ModusWcButton>
            </div>
          </div>

          <footer className="studio-canvas-history">
            <div className="studio-canvas-history-label">
              <ModusWcIcon decorative name="history" size="sm" />
              History
            </div>
            <ModusWcIcon decorative name="expand_more" size="sm" />
          </footer>
        </section>

        {propertiesNode && !showPropertiesPanel && (
          <ModusWcButton
            color="tertiary"
            customClass="studio-canvas-rail-tab studio-canvas-rail-tab--right"
            onButtonClick={() => setPropertiesPanelOpen(true)}
            size="sm"
            variant="borderless"
          >
            Properties
            <ModusWcIcon decorative name="caret_left" size="sm" />
          </ModusWcButton>
        )}

        {showPropertiesPanel && propertiesNode && (
          <StudioCanvasPropertiesPanel
            configFields={propertiesConfigFields}
            configValues={propertiesConfigValues}
            node={propertiesNode}
            readOnly={isReadOnlyCanvas}
            onConfigChange={handleConfigChange}
            onClose={() => setPropertiesPanelOpen(false)}
          />
        )}
      </div>

      {!isReadOnlyCanvas && (
        <>
          <StudioChooseStarterModal
            isOpen={starterBrowseOpen}
            selectedStarterId={starterStep?.id ?? null}
            onClose={() => setStarterBrowseOpen(false)}
            onSelectStarter={handleSelectStarter}
          />

          <StudioChooseActionModal
            isOpen={actionBrowseOpen}
            selectedActionId={panelHighlightedActionId}
            onClose={() => setActionBrowseOpen(false)}
            onSelectAction={placeActionOnCanvas}
          />
        </>
      )}
    </div>
  );
}
