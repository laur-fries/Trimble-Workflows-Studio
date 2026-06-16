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
  FLOW_STARTER_SLOT_ID,
  findWorkflowStarterById,
  type FlowCanvasSlot,
  type OperationItem,
  type StudioTemplate,
  type WorkflowActionItem,
  type WorkflowCanvasNode,
} from './data';
import { findWorkflowActionById } from './workflowActionLibrary';
import { readActionDragId, isActionDrag, isStarterDrag, readStarterDragId } from './starterDrag';
import { getStudioStepConfigFields } from './stepConfigFields';

interface StudioCanvasProps {
  template: StudioTemplate | null;
  highlightStartNode?: boolean;
  assistantPrompt?: string;
  onBack?: () => void;
}

type DropZoneHighlight = 'none' | 'valid' | 'invalid';

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

export default function StudioCanvas({
  template,
  highlightStartNode = false,
  assistantPrompt = '',
  onBack,
}: StudioCanvasProps) {
  const [workflowTitle, setWorkflowTitle] = useState(template?.title ?? 'Untitled Workflow');
  const [stepsPanelOpen, setStepsPanelOpen] = useState(true);
  const [propertiesPanelOpen, setPropertiesPanelOpen] = useState(false);
  const [activeFlowSlot, setActiveFlowSlot] = useState<FlowCanvasSlot>('starter');
  const [starterStep, setStarterStep] = useState<OperationItem | null>(null);
  const [actionStep, setActionStep] = useState<WorkflowActionItem | null>(null);
  const [starterBrowseOpen, setStarterBrowseOpen] = useState(false);
  const [actionBrowseOpen, setActionBrowseOpen] = useState(false);
  const [starterDropHighlight, setStarterDropHighlight] = useState<DropZoneHighlight>('none');
  const [actionDropHighlight, setActionDropHighlight] = useState<DropZoneHighlight>('none');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(FLOW_STARTER_SLOT_ID);
  const [nodeActiveStates, setNodeActiveStates] = useState<Record<string, boolean>>({});
  const [stepConfigValues, setStepConfigValues] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    if (highlightStartNode) {
      setActiveFlowSlot('starter');
    }
  }, [highlightStartNode]);

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
  const hasActionStep = Boolean(actionStep);

  const canvasNodes = useMemo<WorkflowCanvasNode[]>(() => {
    if (templateSteps.length > 0) {
      return templateSteps.map((step, index) => ({
        id: `template-step-${index}`,
        label: step,
        icon: index === 0 ? 'play_circle' : 'flowchart',
        isStarter: index === 0,
      }));
    }

    return [];
  }, [templateSteps]);

  const propertiesNode = useMemo<WorkflowCanvasNode | null>(() => {
    if (!isBlankWorkflow) {
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

    if (actionStep && selectedNodeId === actionStep.id) {
      return {
        id: actionStep.id,
        label: actionStep.label,
        icon: actionStep.icon,
        isStarter: false,
      };
    }

    return null;
  }, [actionStep, canvasNodes, isBlankWorkflow, selectedNodeId, starterStep]);

  const propertiesConfigFields = propertiesNode
    ? getStudioStepConfigFields(propertiesNode.id, Boolean(propertiesNode.isStarter))
    : [];
  const propertiesConfigValues = propertiesNode
    ? (stepConfigValues[propertiesNode.id] ?? {})
    : {};
  const propertiesNodeIsActive = propertiesNode
    ? (nodeActiveStates[propertiesNode.id] ?? true)
    : true;
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
    if (actionStep) {
      setSelectedNodeId(actionStep.id);
      setPropertiesPanelOpen(true);
      return;
    }

    setSelectedNodeId(FLOW_ACTION_SLOT_ID);
    setPropertiesPanelOpen(false);
  };

  const handleSelectStarter = (item: OperationItem) => {
    setStarterStep(item);
    setActiveFlowSlot('action');
    setSelectedNodeId(item.id);
    setPropertiesPanelOpen(true);
  };

  const handleSelectAction = (item: WorkflowActionItem) => {
    setActionStep(item);
    setActiveFlowSlot('action');
    setSelectedNodeId(item.id);
    setPropertiesPanelOpen(true);
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

  const handleActionDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setActionDropHighlight('none');

    const actionId = readActionDragId(event);
    if (!actionId) {
      return;
    }

    const item = findWorkflowActionById(actionId);
    if (item) {
      handleSelectAction(item);
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

  const handleActionSectionDragOver = (event: React.DragEvent<HTMLDivElement>) => {
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
    actionStep && selectedNodeId === actionStep.id ? 'is-node-selected' : '',
    actionDropHighlight === 'valid' ? 'is-drop-zone-valid' : '',
    actionDropHighlight === 'invalid' ? 'is-drop-zone-invalid' : '',
  ]
    .filter(Boolean)
    .join(' ');

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
            <ModusWcBadge color="primary" size="sm" variant="filled" customClass="studio-canvas-version-badge">
              v0.1 Draft
            </ModusWcBadge>
          </div>
        </div>

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
      </header>

      <div className="studio-canvas-body">
        {!stepsPanelOpen && (
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

        {stepsPanelOpen && (
          <StudioCanvasStepsPanel
            panelMode={activeFlowSlot === 'starter' ? 'starter' : 'actions'}
            selectedActionId={actionStep?.id ?? null}
            selectedStarterId={starterStep?.id ?? null}
            onCollapse={() => setStepsPanelOpen(false)}
            onSelectAction={handleSelectAction}
            onSelectStarter={handleSelectStarter}
          />
        )}

        <section className="studio-canvas-workspace" aria-label="Workflow canvas">
          {assistantPrompt && (
            <p className="studio-canvas-assistant-banner">
              Trimble Assistant: {assistantPrompt}
            </p>
          )}

          <div className="studio-canvas-main">
            <div className={`studio-canvas-grid${useCenteredStarterCanvas ? ' studio-canvas-grid--centered' : ''}`}>
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
                      {actionDropHighlight !== 'none' && (
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
                      )}
                      <ModusWcIcon
                        decorative
                        name={actionStep?.icon ?? 'library_add'}
                        size="md"
                        variant="solid"
                        customClass="studio-canvas-starter-node-icon"
                      />
                      <div className="studio-canvas-starter-node-copy">
                        <p className="studio-canvas-starter-node-title">
                          {actionStep?.label ?? 'Choose a step'}
                        </p>
                        <p className="studio-canvas-starter-node-hint">
                          {hasActionStep
                            ? 'Selected action. Add more steps from the library.'
                            : activeFlowSlot === 'action' && (
                              <BrowseHint onBrowse={() => setActionBrowseOpen(true)} />
                            )}
                        </p>
                      </div>
                    </div>
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
                        }${nodeActiveStates[node.id] === false ? ' is-inactive' : ''}`}
                        onClick={() => handleSelectNode(node)}
                      >
                        {node.isStarter ? (
                          <ModusWcIcon decorative name={node.icon} size="sm" variant="solid" />
                        ) : (
                          <span className="studio-canvas-node-index">{index + 1}</span>
                        )}
                        <p>{node.label}</p>
                      </button>
                    </div>
                  ))}
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
            isActive={propertiesNodeIsActive}
            node={propertiesNode}
            onActivate={() => {
              setNodeActiveStates((current) => ({ ...current, [propertiesNode.id]: true }));
            }}
            onConfigChange={handleConfigChange}
            onDeactivate={() => {
              setNodeActiveStates((current) => ({ ...current, [propertiesNode.id]: false }));
            }}
            onClose={() => setPropertiesPanelOpen(false)}
          />
        )}
      </div>

      <StudioChooseStarterModal
        isOpen={starterBrowseOpen}
        selectedStarterId={starterStep?.id ?? null}
        onClose={() => setStarterBrowseOpen(false)}
        onSelectStarter={handleSelectStarter}
      />

      <StudioChooseActionModal
        isOpen={actionBrowseOpen}
        selectedActionId={actionStep?.id ?? null}
        onClose={() => setActionBrowseOpen(false)}
        onSelectAction={handleSelectAction}
      />
    </div>
  );
}
